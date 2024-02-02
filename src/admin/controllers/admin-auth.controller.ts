import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../guards';
import { AuthenticatedAdmin } from '../decorators';
import { AdminDocument } from '../models/admin.model';
import { AdminLoginDto, InviteAdminDto } from '../dtos';
import { AdminAuthService } from '../services';
import { MongoIdDto } from 'src/common';

@ApiTags('Admin-Auth')
@ApiBearerAuth()
@Controller({
  version: '1',
  path: 'admin-auth',
})
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('invite-admin')
  @ApiOperation({ summary: `Used to invite admins by the super admin` })
  @UseGuards(JwtAdminAuthGuard)
  async inviteAdmin(
    @Body() body: InviteAdminDto,
    @AuthenticatedAdmin() admin: AdminDocument,
  ) {
    return this.adminAuthService.inviteAdmin(body, admin);
  }

  @Post('login')
  @ApiOperation({ summary: `Logs an admin in` })
  async login(@Body() body: AdminLoginDto) {
    return this.adminAuthService.login(body);
  }

  @Delete('delete-admin/:id')
  @ApiOperation({ summary: `Delete an admin` })
  @UseGuards(JwtAdminAuthGuard)
  async deleteAdmin(
    @Param() params: MongoIdDto,
    @AuthenticatedAdmin() admin: AdminDocument,
  ) {
    return this.adminAuthService.deleteAdmin(params, admin);
  }
}
