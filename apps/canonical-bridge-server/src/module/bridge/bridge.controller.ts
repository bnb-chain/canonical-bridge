import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { CACHE_KEY } from '@/common/constants';

@Controller('bridge')
export class BridgeController {
  private logger = new Logger(BridgeController.name);

  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  @Get('/cbridge')
  getCbridgeConfig() {
    return this.cache.get(CACHE_KEY.CBRIDGE_CONFIG);
  }

  @Get('/debridge')
  getDeBridgeConfig() {
    return this.cache.get(CACHE_KEY.DEBRIDGE_CONFIG);
  }
}
