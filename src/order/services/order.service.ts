import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateDeliveryFeeDto,
  CreateOrderDto,
  FetchAllOrdersDto,
  PayForOrderDto,
  UpdateDeliveryFeeDto,
} from '../dtos';
import {
  DeliveryType,
  IInitializeTransactionRes,
  IUser,
  OrderStatus,
  PaymentRequestPayload,
} from 'src/common';
import { OrderDiscountVoucherDocument, OrderedProducts } from '../models';
import {
  OrderRepository,
  OrderedProductsRepository,
  OrderDeliveryFeesRepository,
  OrderDiscountVoucherRepository,
} from '../repository';
import { ProductRepository } from 'src/product';
import { PaystackPayService } from 'src/payment';
import { catchError, lastValueFrom, map } from 'rxjs';
import { TokenService } from 'src/auth';
import { UserService } from 'src/user';

@Injectable()
export class OrderService {
  private logger: Logger = new Logger(OrderService.name);
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly orderedProductsRepo: OrderedProductsRepository,
    private readonly orderDeliveryFeesRepo: OrderDeliveryFeesRepository,
    private readonly productRepo: ProductRepository,
    private readonly orderDiscountVoucherRepo: OrderDiscountVoucherRepository,
    private readonly paystack: PaystackPayService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  async getDeliveryFees() {
    const foundDeliveryFeesInDd = await this.orderDeliveryFeesRepo.find();

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully fetched delivery fees',
      data: foundDeliveryFeesInDd,
    };
  }

  async getDiscountVoucher(discountCode?: string) {
    if (!discountCode)
      return {
        statusCode: HttpStatus.AMBIGUOUS,
        message: 'No discount code provided',
        data: null,
      };
    const foundDiscountVoucherInDb =
      await this.orderDiscountVoucherRepo.findOne({
        discountCode: discountCode,
      });
    if (!foundDiscountVoucherInDb)
      throw new NotFoundException(
        `Could not find discount voucher for discountCode: ${discountCode}`,
      );
    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully retrieved discount voucher',
      data: foundDiscountVoucherInDb,
    };
  }

  async createDeliveryFee(body: CreateDeliveryFeeDto) {
    const createdDeliveryFeeInDb = await this.orderDeliveryFeesRepo.create({
      ...body,
    });
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Successfully created delivery fee',
      data: createdDeliveryFeeInDb,
    };
  }

  async updateDeliveryFee(id: string, body: UpdateDeliveryFeeDto) {
    const { location, price } = body;
    const foundDeliveryFeeInDb = await this.orderDeliveryFeesRepo.findById(id);

    if (!foundDeliveryFeeInDb) {
      throw new NotFoundException(`Delivery fee with id: ${id} not found`);
    }

    foundDeliveryFeeInDb.location = location ?? foundDeliveryFeeInDb.location;
    foundDeliveryFeeInDb.price = price ?? foundDeliveryFeeInDb.price;

    const updatedDeliveryFeeInDb = await foundDeliveryFeeInDb.save();

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully updated delivery fees',
      data: updatedDeliveryFeeInDb,
    };
  }

  async createOrder(body: CreateOrderDto, user: IUser) {
    const { deliveryType } = body;

    if (deliveryType === DeliveryType.pickup) {
      return this.createPickupOrder(body, user);
    }

    if (deliveryType === DeliveryType.delivery) {
      return this.createDeliveryOrder(body, user);
    }

    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Cannot process order creation request',
    };
  }
  async fetchAllOrders(query: FetchAllOrdersDto, user: IUser) {
    const { search } = query;
    const condition = { user: user.id };

    if (search) {
      condition['orderId'] = { $regex: search, $options: 'i' };
    }

    const foundOrdersInDb = await this.orderRepo.findManyWithPagination(
      condition,
      query,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully fetched orders',
      data: foundOrdersInDb,
    };
  }

  async fetchOrderById(id: string) {
    const foundOrderInDb = await this.orderRepo.findById(
      id,
      {},
      {
        populate: ['products', 'deliveryFee', 'discountVoucher'],
      },
    );
    if (!foundOrderInDb) throw new NotFoundException(`Order ${id} not found`);
    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully fetched order',
      data: foundOrderInDb,
    };
  }

  async payForOrder(body: PayForOrderDto) {
    const { id, callback_url } = body;
    const foundOrderInDb = await this.orderRepo.findById(
      id,
      {},
      {
        populate: ['products'],
      },
    );
    if (!foundOrderInDb) throw new NotFoundException('Order not found');
    if (foundOrderInDb.isPaid)
      throw new ConflictException('Order has been paid for already');
    // Todo: check if the items are still available in the database(Cancel order if not available)
    // Todo: modify for order voucher
    const reqPayload: PaymentRequestPayload = {
      email: foundOrderInDb.email,
      amount: foundOrderInDb.total * 100, // convert to kobo
      channels: ['card', 'ussd', 'qr', 'bank_transfer', 'bank'],
      metadata: {
        full_name: foundOrderInDb.firstName,
        paymentType: 'ORDER_PAYMENT',
        orderId: foundOrderInDb.orderId,
      },
    };
    if (callback_url) {
      reqPayload['callback_url'] = callback_url;
    }
    const res = await lastValueFrom(
      this.paystack.initializeTransaction(reqPayload).pipe(
        map(async (res: IInitializeTransactionRes) => {
          return res.data;
        }),
        catchError((err) => {
          this.logger.error('[initiate card payment error]', err);
          throw new InternalServerErrorException(
            `
          Sorry, we could not initiate your payment. Try Again or contact customer support
          `,
          );
        }),
      ),
    );

    foundOrderInDb.authorization_url = res.authorization_url;
    foundOrderInDb.payment_reference = res.reference;

    const updtaedOrderInDb = await foundOrderInDb.save();
    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully intiated order payment',
      data: updtaedOrderInDb,
    };
  }

  async cancelOrder(id: string) {
    const foundOrderInDb = await this.orderRepo.findById(id);
    if (!foundOrderInDb) throw new NotFoundException('Order not found');
    if (foundOrderInDb.status === OrderStatus.COMPLETED)
      throw new ConflictException('Order has already been completed');
    foundOrderInDb.status = OrderStatus.CANCELLED;
    const updatedOrderInDb = await foundOrderInDb.save();
    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully cancelled order',
      data: updatedOrderInDb,
    };
  }

  private async generateOrderId() {
    const prefix = 'PH';
    const order = await this.orderRepo.findOne({}, undefined, {
      sort: { createdAt: -1 },
    });

    let currentOrderNumber =
      order && order.orderId ? +order.orderId.substring(2) : 0;

    // Increment the orderId
    currentOrderNumber++;

    // Convert the orderId to a string and pad with leading zeros to ensure at least three characters
    const paddedOrderId = currentOrderNumber.toString().padStart(3, '0');

    return prefix + paddedOrderId;
  }

  private async createDeliveryOrder(body: CreateOrderDto, user: IUser) {
    const {
      products,
      discountCode,
      postalCode,
      deliveryType,
      deliveryFee,
      email,
    } = body;

    const validatedDetails = await this.validateDeliveryDetails(body);
    const { subTotal } = await this.calculateOrderSubTotal(products);
    const { data } = await this.getDiscountVoucher(discountCode);
    const total = await this.calculateTotalOrderPrice(
      subTotal,
      validatedDetails.deliveryFee,
      data,
    );
    const savedOrderedProduct = await this.createOrderedProduct(products);
    const orderId = await this.generateOrderId();
    let foundUserInDb;

    if (!user) {
      foundUserInDb = await this.userService.findUserbyEmail(email);
      if (!foundUserInDb) {
        foundUserInDb = await this.userService.createUser({
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ...(({ deliveryFee, city, ...rest }) => rest)(validatedDetails),
          password: email,
        });
      }
    }

    const { accessToken, refreshToken } =
      await this.tokenService.handleCreateTokens(
        user ? user.id : foundUserInDb.id,
      );

    const createdOrder = await this.orderRepo.create({
      ...validatedDetails,
      deliveryFee,
      discountVoucher: data && data.id,
      postalCode,
      subTotal,
      total,
      deliveryType,
      orderId,
      products: savedOrderedProduct,
      user: user ? user.id : foundUserInDb.id,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Successfully created order',
      data: {
        order: createdOrder,
        user: foundUserInDb,
        accessToken,
        refreshToken,
      },
    };
  }

  private async createPickupOrder(body: CreateOrderDto, user: IUser) {
    const { products, discountCode, postalCode, deliveryType, email } = body;
    const validatedDetails = await this.validateDeliveryDetails(body);
    const { data } = await this.getDiscountVoucher(discountCode);
    const { subTotal } = await this.calculateOrderSubTotal(products);
    const total = await this.calculateTotalOrderPrice(subTotal, null, data);
    const savedOrderedProduct = await this.createOrderedProduct(products);
    const orderId = await this.generateOrderId();
    let foundUserInDb;

    if (!user) {
      foundUserInDb = await this.userService.findUserbyEmail(email);
      if (!foundUserInDb) {
        foundUserInDb = await this.userService.createUser({
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ...(({ deliveryFee, city, ...rest }) => rest)(validatedDetails),
          password: email,
        });
      }
    }

    const { accessToken, refreshToken } =
      await this.tokenService.handleCreateTokens(
        user ? user.id : foundUserInDb.id,
      );

    const createdOrder = await this.orderRepo.create({
      ...validatedDetails,
      discountVoucher: data && data.id,
      postalCode,
      subTotal,
      total,
      deliveryType,
      orderId,
      products: savedOrderedProduct,
      user: user ? user.id : foundUserInDb.id,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Successfully created order',
      data: {
        order: createdOrder,
        user: foundUserInDb,
        accessToken,
        refreshToken,
      },
    };
  }

  private async createOrderedProduct(products: OrderedProducts[]) {
    const orderedProducts = await Promise.all(
      products.map(async (product) => {
        const savedOrderedProduct = await this.orderedProductsRepo.create({
          ...product,
        });
        return savedOrderedProduct.id;
      }),
    );
    return orderedProducts;
  }

  private async calculateOrderSubTotal(products: OrderedProducts[]) {
    try {
      const productIds = products.map((product) => product.productId);

      const foundProductsInDb = await this.productRepo.find({
        _id: { $in: productIds },
      });

      const subTotal = foundProductsInDb.reduce((total, product) => {
        const orderedProduct = products.find((p) => p.productId === product.id);

        if (orderedProduct) {
          total += product.price * orderedProduct.quantity;
        }

        return total;
      }, 0);

      return { subTotal };
    } catch (error) {
      console.error('Error calculating order prices:', error);
      throw new InternalServerErrorException('Error calculating order prices');
    }
  }

  async calculateTotalOrderPrice(
    subTotal: number,
    deliveryFee?: number,
    discountVoucher?: OrderDiscountVoucherDocument,
  ) {
    let total = subTotal;
    if (deliveryFee) {
      total += deliveryFee;
    }

    if (discountVoucher) {
      const discount = discountVoucher.percentage / 100;
      total -= total * discount;
    }
    return total;
  }

  private async validateDeliveryDetails(body: CreateOrderDto) {
    const {
      address,
      city,
      email,
      firstName,
      lastName,
      phone,
      deliveryFee,
      deliveryType,
    } = body;
    if (deliveryType === DeliveryType.delivery) {
      if (!address || !city) {
        throw new BadRequestException(
          `Provide delivery details (address and city)`,
        );
      }

      if (!deliveryFee)
        throw new BadRequestException(
          `Please select a standard delivery location for a pickup order`,
        );

      const foundDeliveryFeeInDb = await this.orderDeliveryFeesRepo.findById(
        deliveryFee,
      );

      if (!foundDeliveryFeeInDb)
        throw new NotFoundException(`Delivery fee selected does not exist`);

      return {
        address,
        city,
        email,
        firstName,
        lastName,
        phone,
        deliveryFee: +foundDeliveryFeeInDb.price,
      };
    }
    return {
      email,
      firstName,
      lastName,
      phone,
    };
  }
}
