import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private logger = new Logger(AllExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const error = JSON.stringify({
      origin_url: request.origin_url,
      method: request.method,
      ip: request.ip,
      status,
      response: `${exception}`,
    });
    this.logger.error(error);

    response.status(status).json({
      code: status,
      message: `${exception}`,
    });
  }
}
