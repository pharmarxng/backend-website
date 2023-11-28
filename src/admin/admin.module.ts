import { Module } from '@nestjs/common';
import { ProductModule } from 'src/product/product.module';
import { AdminRepository } from './repository/admin.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { adminModuleCollections } from './config';
// import { AdminMongooseProvider } from './models/admin-mongoose.provicer';
import { AdminSeeder } from './seeder/admin.seeder';
import { OrderModule } from 'src/order/order.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    MongooseModule.forFeature(adminModuleCollections),
    // MongooseModule.forFeatureAsync([AdminMongooseProvider]),
    ProductModule,
    OrderModule,
  ],
  providers: [AdminRepository, AdminSeeder, AdminService],
  controllers: [AdminController],
  exports: [AdminSeeder, AdminService],
})
export class AdminModule {}
