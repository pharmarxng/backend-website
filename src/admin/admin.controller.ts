import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller({
  version: '1',
  path: 'admin',
})
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
}
