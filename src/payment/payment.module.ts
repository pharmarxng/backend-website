import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './services/payment.service';
import { PaystackPayService } from './services/paystack.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [PaymentController],
  providers: [PaymentService, PaystackPayService],
  exports: [PaymentService, PaystackPayService],
})
export class PaymentModule {}
