import { Inject, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '@/shared/database/database.service';
import {
  IDebridgeConfig,
  IDebridgeToken,
  IMesonChain,
  IStargateBridgeTokenInfo,
  ITransferConfigsForAll,
  ITransferToken,
} from '@/shared/web3/web3.interface';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { CACHE_KEY } from '@/common/constants';
import { ITokenPriceRecord } from '@/module/token/token.interface';

@Injectable()
export class BridgeService {
  private logger = new Logger(BridgeService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private databaseService: DatabaseService,
  ) {}

  public async getPriceConfig() {
    const [cmcRes, llamaRes] = await Promise.allSettled([
      this.cache.get<ITokenPriceRecord>(CACHE_KEY.CMC_CONFIG),
      this.cache.get<ITokenPriceRecord>(CACHE_KEY.LLAMA_CONFIG),
    ]);
    return {
      cmc: cmcRes.status === 'fulfilled' ? cmcRes.value : {},
      llama: llamaRes.status === 'fulfilled' ? llamaRes.value : {},
    };
  }

  public hasTokenPrice(params: {
    prices: { cmc?: ITokenPriceRecord; llama?: ITokenPriceRecord };
    tokenSymbol: string;
    tokenAddress: string;
  }) {
    const key1 = params.tokenSymbol?.toLowerCase();
    const key2 = `${params.tokenSymbol?.toLowerCase()}:${params.tokenAddress?.toLowerCase()}`;
    const key3 = `ethereum:${key1}`;

    const price =
      params.prices.cmc?.[key2]?.price ??
      params.prices.llama?.[key2]?.price ??
      params.prices.cmc?.[key1]?.price ??
      params.prices.llama?.[key1]?.price ??
      params.prices.cmc?.[key3]?.price ??
      params.prices.llama?.[key3]?.price;

    return !!price;
  }

  public async removeCBridgeNoPriceTokens(config?: ITransferConfigsForAll) {
    if (!config) return;

    const prices = await this.getPriceConfig();

    const chainToken: Record<number, { token: ITransferToken[] }> = {};
    Object.entries(config.chain_token).forEach(([key, { token }]) => {
      const chainId = Number(key);
      chainToken[chainId] = { token: [] };
      chainToken[chainId].token = token.filter((e) => {
        return this.hasTokenPrice({
          prices,
          tokenAddress: e.token.address,
          tokenSymbol: e.token.symbol,
        });
      });
    });

    const peggedPairConfigs: ITransferConfigsForAll['pegged_pair_configs'] =
      config.pegged_pair_configs.filter((e) => {
        const orgHasPrice = this.hasTokenPrice({
          prices,
          tokenSymbol: e.org_token.token.symbol,
          tokenAddress: e.org_token.token.address,
        });

        const peggedHasPrice = this.hasTokenPrice({
          prices,
          tokenSymbol: e.pegged_token.token.symbol,
          tokenAddress: e.pegged_token.token.address,
        });

        return orgHasPrice && peggedHasPrice;
      });

    const finalConfig: ITransferConfigsForAll = {
      ...config,
      chain_token: chainToken,
      pegged_pair_configs: peggedPairConfigs,
    };

    return finalConfig;
  }

  public async removeDeBridgeNoPriceTokens(config?: IDebridgeConfig) {
    if (!config) return;

    const prices = await this.getPriceConfig();
    const chainTokens: Record<number, IDebridgeToken[]> = {};

    Object.entries(config.tokens).forEach(([key, tokens]) => {
      const chainId = Number(key);
      chainTokens[chainId] = tokens.filter((e) => {
        return this.hasTokenPrice({
          prices,
          tokenAddress: e.address,
          tokenSymbol: e.symbol,
        });
      });
    });

    const finalConfig: IDebridgeConfig = {
      ...config,
      tokens: chainTokens,
    };

    return finalConfig;
  }

  public async removeStargateNoPriceTokens(config?: IStargateBridgeTokenInfo[]) {
    if (!config) return;

    const prices = await this.getPriceConfig();

    const finalConfig = config.filter((e) => {
      return this.hasTokenPrice({
        prices,
        tokenAddress: e.token.address,
        tokenSymbol: e.token.symbol,
      });
    });

    return finalConfig;
  }

  public async removeMesonNoPriceTokens(config?: IMesonChain[]) {
    if (!config) return;

    const prices = await this.getPriceConfig();

    const finalConfig: IMesonChain[] = [];
    config.forEach((chain) => {
      const tokens = chain.tokens.filter((e) => {
        return this.hasTokenPrice({
          prices,
          tokenAddress: e.addr,
          tokenSymbol: e.symbol,
        });
      });
      if (tokens?.length) {
        finalConfig.push({
          ...chain,
          tokens,
        });
      }
    });

    return finalConfig;
  }
}
