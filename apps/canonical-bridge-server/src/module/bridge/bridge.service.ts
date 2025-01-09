import { Inject, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '@/shared/database/database.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { ITokenPriceRecord } from '@/module/token/token.interface';
import { CACHE_KEY } from '@/common/constants';
import { isEmpty } from 'lodash';
import {
  IDebridgeConfig,
  IDebridgeToken,
  IMesonChain,
  IStargateBridgeTokenInfo,
  ITransferConfigsForAll,
  ITransferToken,
} from '@/shared/web3/web3.interface';

@Injectable()
export class BridgeService {
  private logger = new Logger(BridgeService.name);

  constructor(
    private databaseService: DatabaseService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  private updateDeBridgeConfigManually(config?: IDebridgeConfig) {
    if (!config) return config;

    const finalConfig = {
      tokens: [],
      ...config,
    };

    const extraConfigs: Record<number, any[]> = {
      1: [
        {
          action: 'replace',
          target: '0xebd9d99a3982d547c5bb4db7e3b1f9f14b67eb83',
          data: {
            address: '0x2dfF88A56767223A5529eA5960Da7A3F5f766406',
            symbol: 'ID',
            decimals: 18,
            name: 'SPACE ID',
            logoURI: '',
            eip2612: false,
            tags: ['tokens'],
          },
        },
        {
          action: 'append',
          data: {
            address: '0x152649eA73beAb28c5b49B26eb48f7EAD6d4c898',
            symbol: 'Cake',
            decimals: 18,
            name: 'PancakeSwap Token',
            logoURI: '',
            eip2612: false,
            tags: ['tokens'],
          },
        },
      ],
    };

    Object.entries(finalConfig.tokens).forEach(([key, value]) => {
      const chainId = Number(key);
      const extraConfig = extraConfigs[chainId];

      if (extraConfig) {
        extraConfig.forEach((item) => {
          const { action, target, data } = item;
          if (!value[data.address]) {
            if (action === 'replace') {
              const index = value.findIndex((item) => item.address === target);
              if (index > -1) {
                value[index] = data;
              }
            } else if (action === 'append') {
              (value as any).push(data);
            }
          }
        });
      }
    });

    return finalConfig;
  }

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
    if (isEmpty(params.prices.cmc) && isEmpty(params.prices.llama)) {
      return true;
    }
    const key1 = `${params.tokenSymbol?.toLowerCase()}:${params.tokenAddress?.toLowerCase()}`;
    const key3 = params.tokenSymbol?.toLowerCase();
    const key2 = `ethereum:${key3}`;

    const price =
      params.prices.cmc?.[key1]?.price ??
      params.prices.llama?.[key1]?.price ??
      params.prices.cmc?.[key2]?.price ??
      params.prices.llama?.[key2]?.price ??
      params.prices.cmc?.[key3]?.price ??
      params.prices.llama?.[key3]?.price;

    return !!price;
  }

  async getFilteredCBridgeConfig() {
    const config = await this.cache.get<ITransferConfigsForAll>(CACHE_KEY.CBRIDGE_CONFIG);
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

  async getFilteredDeBridgeConfig() {
    const _config = await this.cache.get<IDebridgeConfig>(CACHE_KEY.DEBRIDGE_CONFIG);
    const config = this.updateDeBridgeConfigManually(_config);
    if (!config) return config;

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

  async getFilteredStargateConfig() {
    const config = await this.cache.get<IStargateBridgeTokenInfo[]>(CACHE_KEY.STARGATE_CONFIG);
    if (!config) return config;

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

  async getFilteredMesonConfig() {
    const config = await this.cache.get<IMesonChain[]>(CACHE_KEY.MESON_CONFIG);
    if (!config) return config;

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
