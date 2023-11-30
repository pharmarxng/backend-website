import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { HttpLoggerMiddleware } from './common/http-logger.middleware';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { AdminSeeder } from './admin/seeder/admin.seeder';
import { PaymentModule } from './payment/payment.module';
import { OrderModule } from './order/order.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    CommonModule,
    AuthModule,
    ProductModule,
    UserModule,
    AdminModule,
    PaymentModule,
    OrderModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule, OnApplicationBootstrap {
  constructor(private readonly adminSeeder: AdminSeeder) {}

  async onApplicationBootstrap() {
    await this.adminSeeder.seedAdminUser();
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
