import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AdminDocument } from '../models/admin.model';

export const AuthenticatedAdmin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    if (ctx.getType() === 'http') {
      return ctx.switchToHttp().getRequest().admin as AdminDocument;
    }
    if (ctx.getType() === 'ws') {
      return ctx.switchToWs().getClient().admin as AdminDocument;
    }
    if (ctx.getType() === 'rpc') {
      return ctx.switchToRpc().getData().admin as AdminDocument;
    }
  },
);
