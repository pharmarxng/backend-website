import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtOptionalUserAuthGuard extends AuthGuard(
  'optional-user-passport-strategy',
) {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // You can add custom logic here if needed
    return super.canActivate(context);
  }

  handleRequest<TUser>(err: any, user: TUser): TUser {
    if (err || !user) {
      return null;
    }
    return user;
  }
}
