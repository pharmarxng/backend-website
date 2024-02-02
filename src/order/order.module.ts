import { Module } from '@nestjs/common';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { OrderRepository } from './repository/order.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { orderModuleCollections } from './config';
import { OrderDeliveryFeesRepository } from './repository/order-delivery-fees.repository';
import { OrderedProductsRepository } from './repository/ordered-products.repository';
import { ProductModule } from 'src/product/product.module';
import { OrderDiscountVoucherRepository } from './repository';
import { PaymentModule } from 'src/payment/payment.module';
import { WebhookController } from './controllers';
import { WebhookService } from './services';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { MailingModule } from 'src/mailing/mailing.module';
import { MailingService } from 'src/mailing/mailing.service';

@Module({
  imports: [
    MongooseModule.forFeature(orderModuleCollections),
    ProductModule,
    PaymentModule,
    AuthModule,
    UserModule,
    MailingModule,
  ],
  controllers: [OrderController, WebhookController],
  providers: [
    OrderService,
    OrderRepository,
    OrderDeliveryFeesRepository,
    OrderedProductsRepository,
    OrderDiscountVoucherRepository,
    WebhookService,
    MailingService,
  ],
  exports: [OrderService, OrderRepository],
})
export class OrderModule {}
