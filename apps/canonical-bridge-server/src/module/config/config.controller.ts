import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { CACHE_KEY } from '@/common/constants';

@Controller('config')
export class ConfigController {
  private logger = new Logger(ConfigController.name);

  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  @Get('/chains')
  getChains() {
    return this.cache.get(CACHE_KEY.CHAINS_CONFIG);
  }

  @Get('/transfer')
  getTransferConfigs() {
    return this.cache.get(CACHE_KEY.TRANSFER_CONFIG);
  }
}
