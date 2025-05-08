import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class InvokeRecordInterceptor implements NestInterceptor {
  private readonly logger = new Logger(InvokeRecordInterceptor.name);

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const request = ctx.switchToHttp().getRequest<Request>();
    const response = ctx.switchToHttp().getRequest<Response>();

    const userAgent = request.headers['user-agent'];
    const ip = request.ip;
    const url = request.originalUrl;
    const method = request.method;
    const statusCode = response.statusCode;
    const timestamp = Date.now();

    this.logger.debug(
      `${userAgent} ${ip} ${url} ${method} ${statusCode} ${timestamp.toLocaleString()} ${ctx.getClass().name} ${ctx.getHandler().name} invoked...`,
    );
    // request.user.userId 能获取到数据，是因为在 login.guard.ts 中将 user 对象挂载到了 request 对象上
    // guard 的执行顺序比 interceptor 要早
    this.logger.debug(`user: ${userAgent} ${request?.user?.userId} ${request?.user?.username}`);

    return next.handle().pipe(
      tap((res) => {
        this.logger.debug(`${url} ${method} ${statusCode} ${Date.now() - timestamp}ms`);
        this.logger.debug(`response: ${JSON.stringify(res)}`);
      }),
    );
  }
}
