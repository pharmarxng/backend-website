import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from 'src/user/repository/user.repository';

@Injectable()
export class JwtOptionalUserPassportStrategy extends PassportStrategy(
  Strategy,
  'optional-user-passport-strategy',
) {
  private readonly logger: Logger = new Logger(
    JwtOptionalUserPassportStrategy.name,
  );

  constructor(
    private readonly configService: ConfigService,
    private userRepo: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    this.logger.debug('fetching user from DB');
    const user = await this.userRepo.findOne({ _id: payload.userId });
    // if (!user) throw new UnauthorizedException();
    // this.logger.debug(`Validated user with id ${payload.userId}`);
    return user || null;
  }
}
