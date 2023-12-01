import { Module } from '@nestjs/common';
import { PaymentController } from './controllers/payment.controller';
import { PaystackPayService } from './services/paystack.service';
import { HttpModule } from '@nestjs/axios';
import { TransactionRepository } from './repository';
import { paymentModuleCollections } from './config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [HttpModule, MongooseModule.forFeature(paymentModuleCollections)],
  controllers: [PaymentController],
  providers: [PaystackPayService, TransactionRepository],
  exports: [PaystackPayService, TransactionRepository],
})
export class PaymentModule {}
