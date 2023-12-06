import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateDeliveryFeeDto, UpdateDeliveryFeeDto } from 'src/order';
import { MongoIdDto } from 'src/common';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller({
  version: '1',
  path: 'admin',
})
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // async inviteAdmin() {}

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
}
