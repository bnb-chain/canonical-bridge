import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { timeout } from 'rxjs';
import { SERVER_TIMEOUT } from '../constants';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(timeout(SERVER_TIMEOUT));
  }
}
