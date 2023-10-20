import { Injectable, Logger } from '@nestjs/common';
import { AdminRepository } from './repository/admin.repository';

@Injectable()
export class AdminService {
  private readonly logger: Logger = new Logger(AdminService.name);
  constructor(private readonly adminRepo: AdminRepository) {}
}
