import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from '../services/admin.service';
import { CreateDeliveryFeeDto, UpdateDeliveryFeeDto } from 'src/order';
import { FindManyDto, MongoIdDto } from 'src/common';
import { JwtAdminAuthGuard } from '../guards';
import {
  AddCategoryDto,
  ConfirmOrder,
  CreateProductDto,
  EditCategoryDto,
  EditProductDto,
  GetProductsQueryDto,
} from '../dtos';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAdminAuthGuard)
@Controller({
  version: '1',
  path: 'admin',
})
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create-delivery-fee')
  @ApiOperation({
    summary: `Create standard delivery fees for different locations`,
  })
  async createDeliveryFee(@Body() body: CreateDeliveryFeeDto) {
    return this.adminService.createDeliveryFee(body);
  }

  @Patch('update-delivery-fee/:id')
  @ApiOperation({
    summary: `Updates the standard delivery fees for different locations`,
  })
  async updateDeliveryFee(
    @Param() params: MongoIdDto,
    @Body() body: UpdateDeliveryFeeDto,
  ) {
    return this.adminService.updateDeliveryFee(params.id, body);
  }

  @Get('get-delivery-fees')
  @ApiOperation({ summary: `Get the standard delivery fees` })
  async getDeliveryFees() {
    return this.adminService.getDeliveryFees();
  }

  @Get('get-delivery-by-id/:id')
  @ApiOperation({ summary: `Get the standard delivery fee by id` })
  async getDeliveryFeeById(@Param() params: MongoIdDto) {
    return this.adminService.getDeliveryFeeById(params);
  }

  @Delete('delete-delivery-fee/:id')
  @ApiOperation({
    summary: `Deletes the standard delivery fees for different locations`,
  })
  async deleteDeliveryFee(@Param() params: MongoIdDto) {
    return this.adminService.deleteDeliveryFee(params.id);
  }

  @Post('add-category')
  @ApiOperation({ summary: `Adds a product new category` })
  async addCategory(@Body() body: AddCategoryDto) {
    return this.adminService.addCategory(body);
  }

  @Patch('edit-category/:id')
  @ApiOperation({ summary: `Edit a category` })
  async editCategory(
    @Param('id') id: MongoIdDto,
    @Body() body: EditCategoryDto,
  ) {
    return this.adminService.editCategory(id, body);
  }

  @Get('get-all-categories')
  @ApiOperation({ summary: `Get all categories` })
  async getAllCategories() {
    return this.adminService.getAllCategories();
  }

  @Get('get-category/:id')
  @ApiOperation({ summary: `Get a category by id` })
  async getCategoryById(@Param() params: MongoIdDto) {
    return this.adminService.getCategoryById(params);
  }

  @Delete('delete-category/:id')
  @ApiOperation({ summary: `Delete a category by id` })
  async deleteCategoryById(@Param() params: MongoIdDto) {
    return this.adminService.deleteCategoryById(params);
  }

  @Post('create-product')
  @ApiOperation({ summary: `Creates a new product` })
  async createNewProduct(@Body() body: CreateProductDto) {
    return this.adminService.createNewProduct(body);
  }

  @Get('get-products')
  @ApiOperation({ summary: `Used to get products by category` })
  async getProducts(@Query() query: GetProductsQueryDto) {
    return this.adminService.getProducts(query);
  }

  @Get('get-product-by-id/:id')
  @ApiOperation({ summary: `Get a product by id` })
  async getProductById(@Param() params: MongoIdDto) {
    return this.adminService.getProductById(params);
  }

  @Patch('edit-product/:id')
  @ApiOperation({ summary: `Edit a product by id` })
  async editProductById(
    @Param() params: MongoIdDto,
    @Body() body: EditProductDto,
  ) {
    return this.adminService.editProductById(params, body);
  }

  @Delete('delete-product/:id')
  @ApiOperation({ summary: `Delete a product by id` })
  async deleteProductById(@Param() params: MongoIdDto) {
    return this.adminService.deleteProductById(params);
  }

  @Get('fetch-all-orders')
  @ApiOperation({
    summary: `Fetch all orders`,
    description: `Can be filtered by passing in an email`,
  })
  async fetchAllOrders(@Query() query: FindManyDto) {
    return this.adminService.fetchAllOrders(query);
  }

  @Get('fetch-order/:id')
  @ApiOperation({ summary: `Fetch an order by id` })
  async fetchOrderById(@Param() params: MongoIdDto) {
    return this.adminService.fetchOrderById(params);
  }

  @Post('confirm-order/:id')
  @ApiOperation({ summary: `Confirms an order by id` })
  async confirmOrder(@Param() params: MongoIdDto, @Body() body: ConfirmOrder) {
    return this.adminService.confirmOrder(params, body);
  }
}
