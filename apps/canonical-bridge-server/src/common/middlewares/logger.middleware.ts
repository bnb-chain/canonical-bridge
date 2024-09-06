import { Logger, NestMiddleware } from '@nestjs/common';
import { Response, Request } from 'express';

export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: (error?: any) => void) {
    next();

    const log = JSON.stringify({
      original_url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });

    this.logger.log(log);
  }
}
