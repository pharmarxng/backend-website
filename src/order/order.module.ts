import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './repository/order.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { orderModuleCollections } from './config';
import { OrderDeliveryFeesRepository } from './repository/order-delivery-fees.repository';
import { OrderedProductsRepository } from './repository/ordered-products.repository';
import { ProductModule } from 'src/product/product.module';
import { OrderDiscountVoucherRepository } from './repository';

@Module({
  imports: [MongooseModule.forFeature(orderModuleCollections), ProductModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    OrderDeliveryFeesRepository,
    OrderedProductsRepository,
    OrderDiscountVoucherRepository,
  ],
  exports: [OrderService],
})
export class OrderModule {}
