import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { OrderRepository } from 'src/order';
import {
  ChargeDataDto,
  ChargeEventDto,
  DeliveryType,
  PAYMENT_TYPE,
  TEMPLATE_KEY,
} from 'src/common';
import { TransactionRepository } from 'src/payment';
import { MailingService } from 'src/mailing/mailing.service';
import { ZeptoMailService } from 'src/mailing/Zeptomail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookService {
  logger = new Logger(WebhookService.name);
  private phone;
  private baseUrl;
  constructor(
    private readonly transactionRepo: TransactionRepository,
    private orderRepo: OrderRepository,
    private mailingService: MailingService,
    private zeptoMailService: ZeptoMailService,
    private configService: ConfigService,
  ) {
    this.phone = this.configService.get<string>('ADMIN_PHONE');
    this.baseUrl = this.configService.get('FRONTEND_BASE_URL');
  }

  async handleWebhookEvent(eventObj: ChargeEventDto) {
    switch (eventObj.event) {
      case 'charge.success':
        await this.handleOrderPayment(eventObj.data);
        break;
      case 'transfer.failed':
        console.log('transfer failed event received');
        break;
      case 'transfer.reversed':
        console.log('transfer reversed event received');
        break;
      case 'transfer.success':
        console.log('transfer success event received');
        break;
    }
  }

  async handleOrderPayment(data: ChargeDataDto) {
    this.logger.debug('Calling  handleOrderPayment Func');
    const {
      reference,
      status,
      authorization,
      channel,
      amount,
      currency,
      paid_at,
      customer,
      metadata,
    } = data;
    const { orderId } = metadata;
    const order = await this.orderRepo.findOne(
      {
        orderId,
      },
      null,
      {
        populate: [
          { path: 'discountVoucher' },
          { path: 'deliveryFee' },
          { path: 'products', populate: { path: 'productId' } },
          { path: 'user' },
        ],
      },
    );
    if (!order) {
      throw new NotFoundException(
        `No order found with the orderId: ${orderId}`,
      );
    }

    if (order.payment_reference === reference) {
      this.logger.debug(`Reference matched for order with id ${orderId}`);

      const existingTranxRecord = await this.transactionRepo.findOne({
        reference,
      });

      this.logger.debug('Checking if tranx is duplicate');
      // check if tranx is duplicate
      if (existingTranxRecord && order.isPaid) {
        this.logger.debug(
          'Duplicate transaction detected and value provided for order previously',
        );
        return;
      }
      this.logger.debug('Transaction is not duplicate');
      const session = await this.transactionRepo.startTransaction();
      try {
        await this.transactionRepo.create({
          amount: amount / 100, //convert from kobo to naira
          currency: currency,
          reference: reference,
          status: status,
          channel: authorization.channel || channel,
          email: customer.email,
          gateway: 'paystack',
          transaction_date: paid_at,
          orderId: order.orderId,
        });

        this.logger.debug({ traxStatus: status });

        if (status === 'success') {
          order.isPaid = true;
          order.paymentType =
            (authorization.channel as PAYMENT_TYPE) ||
            (channel as PAYMENT_TYPE);
          await order.save();
          console.log('It got here');
          console.log({ products: order.products });

          // Todo inform the order service that the order payment has been received
          await this.zeptoMailService.sendmail(
            TEMPLATE_KEY.ORDER_CONFIRMATION,
            {
              email: order.email,
              name: order.firstName,
            },
            {
              firstName: order.firstName,
              delivery:
                order.deliveryType === DeliveryType.delivery ? true : false,
              address: order.address,
              orderId: order.orderId,
              orderDate: new Date(),
              products: order.products.map((product) => ({
                image: product.productId.image,
                name: product.productId.name,
                quantity: product.quantity,
                price: product.productId.price,
              })),
              subTotal: order.subTotal,
              shiping: order.deliveryFee ? order.deliveryFee.price : 0,
              tax: 0,
              total: order.total,
              phone: this.phone,
              orderLink: `${this.baseUrl}/order-details/${order.id}`,
            },
          );
          console.log('It got here tooo');
          // Todo reduce the amount of available products
        } else {
          order.isPaid = false;
          await order.save();
          // save the updated order details to the database;
        }
        await session.commitTransaction();
      } catch (err) {
        await session.abortTransaction();
        console.log({ error: err });
        this.logger.error({ error: err });

        throw new InternalServerErrorException(
          'Unable to process transfer request at the moment, please try again later.',
        );
      } finally {
        await session.endSession();
      }
    }
  }
}
