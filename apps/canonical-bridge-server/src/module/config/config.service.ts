import { CACHE_KEY } from '@/common/constants';
import { Web3Service } from '@/shared/web3/web3.service';
import { IChainConfig } from '@bnb-chain/canonical-bridge-sdk';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private logger = new Logger(ConfigService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private web3Service: Web3Service,
  ) {}

  async getChains() {
    const chains = await this.cache.get<IChainConfig[]>(CACHE_KEY.CHAINS_CONFIG);
    if (chains) return chains;

    return await this.web3Service.getCmsChains();
  }

  async getChainCmcPlatforms() {
    const chains = await this.getChains();
    return chains.filter((e) => e.extra?.cmcPlatform).map((e) => e.extra?.cmcPlatform);
  }

  async getChainLlamaPlatforms() {
    const chains = await this.getChains();
    return chains.filter((e) => e.extra?.llamaPlatform).map((e) => e.extra?.llamaPlatform);
  }

  async getChainIds() {
    const chains = await this.getChains();
    return chains.map((e) => e.id);
  }

  async getFormattedAddress(chains: IChainConfig[], chainId?: number, address?: string) {
    const chainInfo = chains.find((e) => e.id === chainId);
    if (chainInfo?.chainType !== 'evm') {
      return address;
    }
    return address?.toLowerCase();
  }

  getChainConfigByCmcPlatform(chains: IChainConfig[], platform: string) {
    return chains.find((e) => e.extra?.cmcPlatform === platform);
  }

  getChainConfigByLlamaPlatform(chains: IChainConfig[], platform: string) {
    return chains.find((e) => e.extra?.llamaPlatform === platform);
  }

  getChainConfigByChainId(chains: IChainConfig[], chainId: number) {
    return chains.find((e) => e.id === chainId);
  }
}
