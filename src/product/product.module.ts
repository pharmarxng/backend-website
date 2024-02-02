import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { ProductRepository } from './repository/product.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { productModuleCollections } from './config';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { CategoryRepository } from './repository/category.repository';

@Module({
  imports: [MongooseModule.forFeature(productModuleCollections)],
  controllers: [ProductController, CategoryController],
  providers: [
    ProductService,
    ProductRepository,
    CategoryService,
    CategoryRepository,
  ],
  exports: [
    ProductService,
    CategoryService,
    ProductRepository,
    CategoryRepository,
  ],
})
export class ProductModule {}
