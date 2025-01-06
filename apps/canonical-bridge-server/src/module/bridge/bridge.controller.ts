import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { CACHE_KEY } from '@/common/constants';
import { BridgeService } from '@/module/bridge/bridge.service';
import {
  IDebridgeConfig,
  IMesonChain,
  IStargateBridgeTokenInfo,
  ITransferConfigsForAll,
} from '@/shared/web3/web3.interface';

@Controller('bridge')
export class BridgeController {
  private logger = new Logger(BridgeController.name);

  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private bridgeService: BridgeService,
  ) {}

  @Get('/cbridge')
  async getCbridgeConfig() {
    const config = await this.cache.get<ITransferConfigsForAll>(CACHE_KEY.CBRIDGE_CONFIG);
    return this.bridgeService.removeCBridgeNoPriceTokens(config);
  }

  @Get('/debridge')
  async getDeBridgeConfig() {
    const config = await this.cache.get<IDebridgeConfig>(CACHE_KEY.DEBRIDGE_CONFIG);
    return this.bridgeService.removeDeBridgeNoPriceTokens(config);
  }

  @Get('/stargate')
  async getStargateConfig() {
    const config = await this.cache.get<IStargateBridgeTokenInfo[]>(CACHE_KEY.STARGATE_CONFIG);
    return this.bridgeService.removeStargateNoPriceTokens(config);
  }

  @Get('/meson')
  async getMesonConfig() {
    const config = await this.cache.get<IMesonChain[]>(CACHE_KEY.MESON_CONFIG);
    return this.bridgeService.removeMesonNoPriceTokens(config);
  }
}
