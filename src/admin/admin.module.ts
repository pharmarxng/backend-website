import { Module } from '@nestjs/common';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [ProductModule],
  providers: [],
  controllers: [],
})
export class AdminModule {}
