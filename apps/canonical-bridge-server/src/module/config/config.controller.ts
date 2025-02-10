import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { CACHE_KEY } from '@/common/constants';
import { ConfigService } from '@/module/config/config.service';

@Controller('config')
export class ConfigController {
  private logger = new Logger(ConfigController.name);

  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private configService: ConfigService,
  ) {}

  @Get('/chains')
  getChains() {
    return this.configService.getChains();
  }

  @Get('/transfer')
  getTransferConfigs() {
    return this.cache.get(CACHE_KEY.TRANSFER_CONFIG);
  }

  @Get('/global')
  getGlobalConfig() {
    return this.cache.get(CACHE_KEY.GLOBAL_CONFIG);
  }
}
