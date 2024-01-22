import { Module } from '@nestjs/common';
import { HttpLoggerMiddleware } from './http-logger.middleware';
import {
  JwtAdminAuthGuard,
  JwtAdminPassportStrategy,
  JwtOptionalUserAuthGuard,
  JwtOptionalUserPassportStrategy,
  JwtUserAuthGuard,
  JwtUserPassportStrategy,
} from './guards';
import { UserModule } from 'src/user/user.module';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  exports: [
    HttpLoggerMiddleware,
    JwtOptionalUserAuthGuard,
    JwtUserAuthGuard,
    JwtUserPassportStrategy,
    JwtOptionalUserPassportStrategy,
    JwtAdminPassportStrategy,
    JwtAdminAuthGuard,
  ],
  imports: [UserModule, AdminModule],
  controllers: [],
  providers: [
    HttpLoggerMiddleware,
    JwtOptionalUserAuthGuard,
    JwtUserAuthGuard,
    JwtUserPassportStrategy,
    JwtOptionalUserPassportStrategy,
    JwtAdminPassportStrategy,
    JwtAdminAuthGuard,
  ],
})
export class CommonModule {}
