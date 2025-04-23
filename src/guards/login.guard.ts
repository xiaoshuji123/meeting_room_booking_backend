import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

interface User {
  userId: number;
  username: string;
  roles: string[];
  permissions: string[];
}

declare module 'express' {
  interface Request {
    user: User;
  }
}

@Injectable()
// 登录守卫，用于检查用户是否登录
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(Reflector)
  private reflector: Reflector;

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // 获取当前请求是否需要登录
    const requiredLogin = this.reflector.getAllAndOverride<boolean>('require_login', [
      context.getHandler(),
      context.getClass(),
    ]);
    // 如果不需要登录，则直接返回 true
    if (!requiredLogin) {
      return true;
    }
    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
    }
    const token = authorization.split(' ')[1];
    try {
      const user = this.jwtService.verify<User>(token);
      request.user = {
        userId: user.userId,
        username: user.username,
        roles: user.roles,
        permissions: user.permissions,
      };
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
}
