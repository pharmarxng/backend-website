import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { FindManyDto, MongoIdDto } from 'src/common';
import { GetAllProductQueryDto } from '../dtos/get-products.dto';

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
  async getAllProducts(@Query() query: GetAllProductQueryDto) {
    return this.productService.getAllProducts(query);
  }

  @Get('get-by-category/:categoryId')
  @ApiOperation({ summary: `Get products by category` })
  async getProductsByCategory(
    @Query() query: FindManyDto,
    @Param('categoryId') categoryId: string,
  ) {
    return this.productService.getProductsByCategory(query, categoryId);
  }

  @Get('get-flash-products')
  @ApiOperation({ summary: `Get products by category` })
  async getFlashProducts(@Query() query: FindManyDto) {
    return this.productService.getFlashProducts(query);
  }

  @Get('get-trending-products')
  @ApiOperation({ summary: `Get a list of trending products` })
  async getTrendingProducts() {
    return this.productService.getTrendingProducts();
  }

  @Get(':id')
  @ApiOperation({ summary: `Gets a product by id` })
  async getProductById(@Param() params: MongoIdDto) {
    return this.productService.getProductById(params.id);
  }
}
