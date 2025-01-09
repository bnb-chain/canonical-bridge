import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private logger = new Logger(ConfigService.name);
}
