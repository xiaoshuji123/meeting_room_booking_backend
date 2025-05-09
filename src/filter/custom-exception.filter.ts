import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
// 全局异常过滤器，格式化返回数据
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    response.statusCode = exception.getStatus();
    const res = exception.getResponse() as { message: string[] };
    response
      .json({
        code: exception.getStatus(),
        message: 'error',
        // 兼容 validator
        data: res?.message?.join ? res?.message?.join(',') : exception.message,
      })
      .end();
  }
}
