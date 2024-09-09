import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { CACHE_KEY } from '@/common/constants';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Controller('token')
export class TokenController {
  private logger = new Logger(TokenController.name);

  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  @Get('/cmc')
  getCmcConfig() {
    return this.cache.get(CACHE_KEY.CMC_CONFIG);
  }
}
