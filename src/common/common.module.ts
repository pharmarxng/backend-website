import { Module } from '@nestjs/common';
import { HttpLoggerMiddleware } from './http-logger.middleware';
import {
  JwtOptionalUserAuthGuard,
  JwtOptionalUserPassportStrategy,
  JwtUserAuthGuard,
  JwtUserPassportStrategy,
} from './guards';
import { UserModule } from 'src/user/user.module';

@Module({
  exports: [
    HttpLoggerMiddleware,
    JwtOptionalUserAuthGuard,
    JwtUserAuthGuard,
    JwtUserPassportStrategy,
    JwtOptionalUserPassportStrategy,
  ],
  imports: [UserModule],
  controllers: [],
  providers: [
    HttpLoggerMiddleware,
    JwtOptionalUserAuthGuard,
    JwtUserAuthGuard,
    JwtUserPassportStrategy,
    JwtOptionalUserPassportStrategy,
  ],
})
export class CommonModule {}
