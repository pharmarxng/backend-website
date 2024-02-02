import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminRepository } from 'src/admin/repository/admin.repository';

@Injectable()
export class JwtAdminPassportStrategy extends PassportStrategy(
  Strategy,
  'admin-passport-strategy',
) {
  private readonly logger: Logger = new Logger(JwtAdminPassportStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private adminRepo: AdminRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    this.logger.debug('fetching admin from DB');
    const admin = await this.adminRepo.findOne({ _id: payload.adminId });
    if (!admin) throw new UnauthorizedException();
    this.logger.debug(`Validated admin with id ${payload.adminId}`);
    return admin || null;
  }
}
