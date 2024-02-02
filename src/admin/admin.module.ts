import { Module } from '@nestjs/common';
import { ProductModule } from 'src/product/product.module';
import { AdminRepository } from './repository/admin.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { adminModuleCollections } from './config';
import { AdminSeeder } from './seeder/admin.seeder';
import { OrderModule } from 'src/order/order.module';
import { AdminController } from './controllers/admin.controller';
import { JwtAdminAuthGuard, JwtAdminPassportStrategy } from './guards';
import { AdminAuthService, AdminService } from './services';
import { AdminAuthController } from './controllers';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AdminTokenService } from './services/admin-token.service';

@Module({
  imports: [
    MongooseModule.forFeature(adminModuleCollections),
    ProductModule,
    OrderModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AdminRepository,
    AdminSeeder,
    AdminService,
    AdminAuthService,
    JwtAdminPassportStrategy,
    JwtAdminAuthGuard,
    AdminTokenService,
  ],
  controllers: [AdminController, AdminAuthController],
  exports: [
    AdminSeeder,
    AdminService,
    AdminAuthService,
    AdminRepository,
    JwtAdminPassportStrategy,
    JwtAdminAuthGuard,
    AdminTokenService,
  ],
})
export class AdminModule {}
