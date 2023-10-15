import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { FindManyDto } from 'src/common';

@ApiTags('Products')
@ApiBearerAuth()
@Controller({
  version: '1',
  path: 'product',
})
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('get-all')
  @ApiOperation({ summary: `Lists all products` })
  async getAllProducts(@Query() query: FindManyDto) {
    return this.productService.getAllProducts(query);
  }

  @Get('get-by-category/:categoryId')
  @ApiOperation({ summary: `Lists all products` })
  async getProductsByCategory(
    @Query() query: FindManyDto,
    @Param('categoryId') categoryId: string,
  ) {
    return this.productService.getProductsByCategory(query, categoryId);
  }

  @Get('get-trending-products')
  @ApiOperation({ summary: `Lists all products` })
  async getTrendingProducts() {
    return this.productService.getTrendingProducts();
  }

  @Get(':id')
  @ApiOperation({ summary: `Gets a product by id` })
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }
}
