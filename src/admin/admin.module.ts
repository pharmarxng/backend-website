import { Module } from '@nestjs/common';
import { ProductModule } from 'src/product/product.module';
import { AdminRepository } from './repository/admin.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { adminModuleCollections } from './config';
import { AdminSeeder } from './seeder/admin.seeder';
import { OrderModule } from 'src/order/order.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtAdminAuthGuard, JwtAdminPassportStrategy } from './guards';

@Module({
  imports: [
    MongooseModule.forFeature(adminModuleCollections),
    ProductModule,
    OrderModule,
  ],
  providers: [
    AdminRepository,
    AdminSeeder,
    AdminService,
    JwtAdminPassportStrategy,
    JwtAdminAuthGuard,
  ],
  controllers: [AdminController],
  exports: [
    AdminSeeder,
    AdminService,
    AdminRepository,
    JwtAdminPassportStrategy,
    JwtAdminAuthGuard,
  ],
})
export class AdminModule {}
