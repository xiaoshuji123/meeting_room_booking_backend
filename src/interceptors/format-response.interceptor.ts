import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const response = ctx.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        return {
          code: response.statusCode,
          message: 'success',
          data,
        };
      }),
    );
  }
}
