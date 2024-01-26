import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateDeliveryFeeDto, UpdateDeliveryFeeDto } from 'src/order';
import { MongoIdDto } from 'src/common';
import { JwtAdminAuthGuard } from './guards';
import { AuthenticatedAdmin } from './decorators';
import { AdminDocument } from './models/admin.model';
import { InviteAdminDto } from './dtos';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAdminAuthGuard)
@Controller({
  version: '1',
  path: 'admin',
})
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  async inviteAdmin(
    @Body() body: InviteAdminDto,
    @AuthenticatedAdmin() admin: AdminDocument,
  ) {
    return this.adminService.inviteAdmin(body, admin);
  }

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
