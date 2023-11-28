import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dtos';

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
}
