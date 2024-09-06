import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs';
import { ENDPOINT_PREFIX } from '../constants';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();

        if (request.originalUrl.startsWith(`/${ENDPOINT_PREFIX}`)) {
          response.setHeader('Content-Type', 'application/json');
          return { code: 0, data, message: 'success' };
        }
        return data;
      }),
    );
  }
}
