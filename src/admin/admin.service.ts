import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AdminRepository } from './repository/admin.repository';
import { CreateDeliveryFeeDto, UpdateDeliveryFeeDto } from 'src/order';
import { OrderService } from 'src/order/services/order.service';
import { AdminDocument } from './models/admin.model';
import { InviteAdminDto } from './dtos';
import { AdminRole } from 'src/common';

@Injectable()
export class AdminService {
  private readonly logger: Logger = new Logger(AdminService.name);
  constructor(
    private readonly adminRepo: AdminRepository,
    private readonly orderService: OrderService,
  ) {}

  async inviteAdmin(body: InviteAdminDto, admin: AdminDocument) {
    const { email, firstName } = body;
    if (!admin.roles.includes(AdminRole.SUPER_ADMIN))
      throw new ForbiddenException(`Only the super admin can invite admins`);
    const foundAdminInDb = await this.adminRepo.findOne({ email });
    if (foundAdminInDb)
      throw new BadRequestException(
        `Admin with email ${foundAdminInDb.email} already exists`,
      );

    const newAdmin = await this.adminRepo.create({
      ...body,
      password: `${email}@${firstName}`,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully invited Admin',
      data: newAdmin,
    };
  }

  async createDeliveryFee(body: CreateDeliveryFeeDto) {
    const newDeliveryFee = await this.orderService.createDeliveryFee(body);

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully created delivery fee',
      data: newDeliveryFee,
    };
  }

  async updateDeliveryFee(id: string, body: UpdateDeliveryFeeDto) {
    const updatedDeliveryFee = await this.orderService.updateDeliveryFee(
      id,
      body,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully updated delivery fee',
      data: updatedDeliveryFee,
    };
  }
}
