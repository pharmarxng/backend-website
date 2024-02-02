import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminRepository } from '../repository/admin.repository';
import { AdminDocument } from '../models/admin.model';
import { AdminLoginDto, InviteAdminDto } from '../dtos';
import { AdminRole, MongoIdDto } from 'src/common';
import { JwtService } from '@nestjs/jwt';
import { AdminTokenService } from './admin-token.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminAuthService {
  private readonly logger: Logger = new Logger(AdminAuthService.name);
  constructor(
    private readonly adminRepo: AdminRepository,
    private readonly jwtService: JwtService,
    private readonly tokenService: AdminTokenService,
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
    const { accessToken, refreshToken } =
      await this.tokenService.handleCreateTokens(newAdmin.id);

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully invited Admin',
      data: {
        admin: newAdmin,
        accessToken,
        refreshToken,
      },
    };
  }

  async login(body: AdminLoginDto) {
    const { email, password } = body;
    const adminInDb = await this.adminRepo.findOne({ email });
    if (!adminInDb) throw new NotFoundException(`Admin not foun`);
    const passwordsMatch = await bcrypt.compare(password, adminInDb.password);
    if (!passwordsMatch) {
      throw new BadRequestException(`Invalid password`);
    }

    const { accessToken, refreshToken } =
      await this.tokenService.handleCreateTokens(adminInDb.id);

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully invited Admin',
      data: {
        admin: adminInDb,
        accessToken,
        refreshToken,
      },
    };
  }

  async deleteAdmin({ id }: MongoIdDto, admin: AdminDocument) {
    if (!admin.roles.includes(AdminRole.SUPER_ADMIN))
      throw new ForbiddenException(`Only the super admin can delete admins`);
    const deletedAdminInDb = await this.adminRepo.findOneAndDelete({ _id: id });

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully invited Admin',
      data: deletedAdminInDb,
    };
  }

  /**
   * @description - Refreshes the expired token
   * @param token - The refresh token of the user
   * @returns - The new access token and refresh token
   */
  async refreshToken(token: string) {
    const { adminId } = await this.jwtService.verify(token);
    if (!adminId) throw new UnauthorizedException('Token Expired');
    const { accessToken, refreshToken } =
      await this.tokenService.handleCreateTokens(adminId);
    return {
      status: HttpStatus.CREATED,
      message: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    };
  }
}
