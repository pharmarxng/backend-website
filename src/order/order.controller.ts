import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto, FetchAllOrdersDto, PayForOrderDto } from './dtos';

@ApiTags('Order')
@ApiBearerAuth()
@Controller({
  version: '1',
  path: 'order',
})
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('get-delivery-fees')
  @ApiOperation({ summary: `Gets the standard delivery fees` })
  async getDeliveryFees() {
    return this.orderService.getDeliveryFees();
  }

  @Get('get-discount-voucher')
  @ApiOperation({
    summary: `Gets the percentage to be removed from an order price on discount application`,
  })
  async getDiscountVoucher(@Query('discountCode') discountCode: string) {
    return this.orderService.getDiscountVoucher(discountCode);
  }

  @Post('create-order')
  @ApiOperation({ summary: `Create a new order` })
  async createOrder(@Body() body: CreateOrderDto) {
    return this.orderService.createOrder(body);
  }

  @Get('fetch-all-orders')
  @ApiOperation({
    summary: `Fetch all orders`,
    description: `Can be filtered by passing in an email`,
  })
  async fetchAllOrders(@Query() query: FetchAllOrdersDto) {
    return this.orderService.fetchAllOrders(query);
  }

  @Get('fetch-order/:id')
  @ApiOperation({ summary: `Fetch an order by id` })
  async fetchOrderById(@Param('id') id: string) {
    return this.orderService.fetchOrderById(id);
  }

  @Post('make-payment')
  @ApiOperation({ summary: `Pay for an order` })
  async payForOrder(@Body() body: PayForOrderDto) {
    return this.orderService.payForOrder(body);
  }
}
