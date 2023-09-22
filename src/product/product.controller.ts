import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProductService } from './product.service';
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

  @Get(':id')
  @ApiOperation({ summary: `Gets a product by id` })
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }
}
