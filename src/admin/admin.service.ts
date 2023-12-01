import { Injectable, Logger } from '@nestjs/common';
import { AdminRepository } from './repository/admin.repository';
import { CreateDeliveryFeeDto, UpdateDeliveryFeeDto } from 'src/order';
import { OrderService } from 'src/order/services/order.service';

@Injectable()
export class AdminService {
  private readonly logger: Logger = new Logger(AdminService.name);
  constructor(
    private readonly adminRepo: AdminRepository,
    private readonly orderService: OrderService,
  ) {}

  async createDeliveryFee(body: CreateDeliveryFeeDto) {
    return this.orderService.createDeliveryFee(body);
  }

  async updateDeliveryFee(id: string, body: UpdateDeliveryFeeDto) {
    return this.orderService.updateDeliveryFee(id, body);
  }
}
