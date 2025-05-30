import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { CACHE_KEY } from '@/common/constants';
import { BridgeService } from '@/module/bridge/bridge.service';

@Controller('bridge')
export class BridgeController {
  private logger = new Logger(BridgeController.name);

  constructor(
    private bridgeService: BridgeService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  @Get('/cbridge')
  getCbridgeConfig() {
    return this.cache.get(CACHE_KEY.CBRIDGE_CONFIG);
  }

  @Get('/debridge')
  getDeBridgeConfig() {
    return this.cache.get(CACHE_KEY.DEBRIDGE_CONFIG);
  }

  @Get('/stargate')
  getStargateConfig() {
    return this.cache.get(CACHE_KEY.STARGATE_CONFIG);
  }

  @Get('/meson')
  getMesonConfig() {
    return this.cache.get(CACHE_KEY.MESON_CONFIG);
  }

  @Get('/v2/cbridge')
  async getCbridgeConfigV2() {
    const config = await this.cache.get(CACHE_KEY.FILTERED_CBRIDGE_CONFIG);
    if (config) {
      return config;
    }

    return this.cache.get(CACHE_KEY.CBRIDGE_CONFIG);
  }

  @Get('/v2/debridge')
  async getDeBridgeConfigV2() {
    const config = await this.cache.get(CACHE_KEY.FILTERED_DEBRIDGE_CONFIG);
    if (config) {
      return config;
    }

    return this.cache.get(CACHE_KEY.DEBRIDGE_CONFIG);
  }

  @Get('/v2/stargate')
  async getStargateConfigV2() {
    const config = await this.cache.get(CACHE_KEY.FILTERED_STARGATE_CONFIG);
    if (config) {
      return config;
    }

    return this.cache.get(CACHE_KEY.STARGATE_CONFIG);
  }

  @Get('/v2/meson')
  async getMesonConfigV2() {
    const config = await this.cache.get(CACHE_KEY.FILTERED_MESON_CONFIG);
    if (config) {
      return config;
    }

    return this.cache.get(CACHE_KEY.MESON_CONFIG);
  }

  @Get('/v2/mayan')
  async getMayanConfigV2() {
    const config = await this.cache.get(CACHE_KEY.FILTERED_MAYAN_CONFIG);
    if (config) {
      return config;
    }

    return this.cache.get(CACHE_KEY.MAYAN_CONFIG);
  }

  @Get('/v2/stat')
  async getStatInfo() {
    return this.bridgeService.getStatInfo();
  }
}
