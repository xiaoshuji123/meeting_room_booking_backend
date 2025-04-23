import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const RequireLogin = () => SetMetadata('require_login', true);
export const RequirePermission = (...permissions: string[]) => SetMetadata('permissions', permissions);

// 获取用户信息方便快捷
export const UserInfo = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  if (!request.user) {
    return null;
  }
  return data ? request.user[data] : request.user;
});
