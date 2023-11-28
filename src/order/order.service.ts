import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateDeliveryFeeDto,
  CreateOrderDto,
  UpdateDeliveryFeeDto,
} from './dtos';
import { DeliveryType } from 'src/common';
import { OrderDiscountVoucherDocument, OrderedProducts } from './models';
import {
  OrderRepository,
  OrderedProductsRepository,
  OrderDeliveryFeesRepository,
  OrderDiscountVoucherRepository,
} from './repository';
import { ProductRepository } from 'src/product';

@Injectable()
export class OrderService {
  private logger: Logger = new Logger(OrderService.name);
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly orderedProductsRepo: OrderedProductsRepository,
    private readonly orderDeliveryFeesRepo: OrderDeliveryFeesRepository,
    private readonly productRepo: ProductRepository,
    private readonly orderDiscountVoucherRepo: OrderDiscountVoucherRepository,
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
      statusCode: HttpStatus.CREATED,
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

  async createOrder(body: CreateOrderDto) {
    const { deliveryType } = body;
    if (deliveryType === DeliveryType.pickup) {
      return this.createPickupOrder(body);
    }

    if (deliveryType === DeliveryType.delivery) {
      return this.createDeliveryOrder(body);
    }

    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Cannot process order creation request',
    };
  }

  async generateOrderId() {
    const prefix = 'PH';
    const { orderId } = await this.orderRepo.findOne({}, undefined, {
      sort: { createdAt: -1 },
    });

    let currentOrderNumber = orderId ? +orderId.substring(2) : 0;
    // Increment the orderId

    currentOrderNumber++;

    // Convert the orderId to a string and pad with leading zeros to ensure at least three characters
    const paddedOrderId = currentOrderNumber.toString().padStart(3, '0');

    return prefix + paddedOrderId;
  }

  private async createDeliveryOrder(body: CreateOrderDto) {
    const { products, discountCode, postalCode, deliveryType, deliveryFee } =
      body;

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
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully created order',
      data: createdOrder,
    };
  }

  private async createPickupOrder(body: CreateOrderDto) {
    const { products, discountCode, postalCode, deliveryType, deliveryFee } =
      body;
    const { data } = await this.getDiscountVoucher(discountCode);
    const { subTotal } = await this.calculateOrderSubTotal(products);
    const total = await this.calculateTotalOrderPrice(subTotal, null, data);
    const savedOrderedProduct = await this.createOrderedProduct(products);
    const orderId = await this.generateOrderId();

    const createdOrder = await this.orderRepo.create({
      deliveryFee,
      discountVoucher: data && data.id,
      postalCode,
      subTotal,
      total,
      deliveryType,
      orderId,
      products: savedOrderedProduct,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully created order',
      data: createdOrder,
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
    const { address, city, email, firstName, lastName, phone, deliveryFee } =
      body;
    if (!address || !city || !email || !firstName || !lastName || !phone) {
      throw new BadRequestException(
        `Provide delivery details (address, city, email, firstName, lastName and phone)`,
      );
    }

    if (!deliveryFee)
      throw new BadRequestException(
        `Please select a standard delivery location for a pickup order`,
      );

    const foundDeliveryFeeInDb = await this.orderDeliveryFeesRepo.findOne({
      _id: deliveryFee,
    });

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
}
