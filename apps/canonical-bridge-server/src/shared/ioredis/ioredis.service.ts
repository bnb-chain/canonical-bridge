import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class IoredisService {
  private logger = new Logger(IoredisService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}
}
