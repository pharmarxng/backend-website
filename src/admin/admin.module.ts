import { Module } from '@nestjs/common';
import { ProductModule } from 'src/product/product.module';
import { AdminRepository } from './repository/admin.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { adminModuleCollections } from './config';
// import { AdminMongooseProvider } from './models/admin-mongoose.provicer';
import { AdminSeeder } from './seeder/admin.seeder';

@Module({
  imports: [
    MongooseModule.forFeature(adminModuleCollections),
    // MongooseModule.forFeatureAsync([AdminMongooseProvider]),
    ProductModule,
  ],
  providers: [AdminRepository, AdminSeeder],
  controllers: [],
  exports: [AdminSeeder],
})
export class AdminModule {}
