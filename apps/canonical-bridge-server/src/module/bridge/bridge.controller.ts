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
    const config = await this.cache.get(CACHE_KEY.FIELDED_CBRIDGE_CONFIG);
    if (config) {
      return config;
    }

    this.logger.log('[cBridge] filtered config is empty');
    return this.cache.get(CACHE_KEY.CBRIDGE_CONFIG);
  }

  @Get('/v2/debridge')
  async getDeBridgeConfigV2() {
    const config = await this.cache.get(CACHE_KEY.FIELDED_DEBRIDGE_CONFIG);
    if (config) {
      return config;
    }

    this.logger.log('[debridge] filtered config is empty');
    return this.cache.get(CACHE_KEY.DEBRIDGE_CONFIG);
  }

  @Get('/v2/stargate')
  async getStargateConfigV2() {
    const config = await this.cache.get(CACHE_KEY.FIELDED_STARGATE_CONFIG);
    if (config) {
      return config;
    }

    this.logger.log('[stargate] filtered config is empty');
    return this.cache.get(CACHE_KEY.STARGATE_CONFIG);
  }

  @Get('/v2/meson')
  async getMesonConfigV2() {
    const config = await this.cache.get(CACHE_KEY.FIELDED_MESON_CONFIG);
    if (config) {
      return config;
    }

    this.logger.log('[meson] filtered config is empty');
    return this.cache.get(CACHE_KEY.MESON_CONFIG);
  }
}
