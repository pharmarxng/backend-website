import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { OrderRepository } from 'src/order';
import { ChargeDataDto, ChargeEventDto, PAYMENT_TYPE } from 'src/common';
import { TransactionRepository } from 'src/payment';
import dayjs from 'dayjs';

@Injectable()
export class WebhookService {
  logger = new Logger(WebhookService.name);
  constructor(
    private readonly transactionRepo: TransactionRepository,
    private orderRepo: OrderRepository,
  ) {}

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
    const order = await this.orderRepo.findOne({
      orderId,
    });
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

          // Todo inform the order service that the order payment has been received
        } else {
          order.isPaid = false;
          await order.save();
          // save the updated order details to the database;
        }
        await session.commitTransaction();
      } catch (err) {
        await session.abortTransaction();
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
