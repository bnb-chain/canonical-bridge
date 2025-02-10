import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { ITokenPriceRecord } from '@/module/token/token.interface';
import { CACHE_KEY } from '@/common/constants';
import { isEmpty } from 'lodash';
import { PrismaService } from '@/shared/prisma/prisma.service';
import {
  BridgeType,
  EVM_NATIVE_TOKEN_ADDRESS,
  ICBridgeTransferConfig,
  IDeBridgeTransferConfig,
  IMesonTransferConfig,
  IStargateTransferConfig,
  TRON_CHAIN_ID,
} from '@bnb-chain/canonical-bridge-sdk';

@Injectable()
export class BridgeService {
  private logger = new Logger(BridgeService.name);

  constructor(
    private prismaService: PrismaService,
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

  async getFilteredLayerZeroConfig() {
    const config = await this.cache.get<ILayerZeroTransferConfigs>(CACHE_KEY.LAYER_ZERO_CONFIG);
    if (!config) return config;

    const prices = await this.getPriceConfig();
    const chainTokens: Record<number, ILayerZeroToken[]> = {};

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

    const finalConfig: ILayerZeroTransferConfigs = {
      ...config,
      tokens: chainTokens,
    };
    return finalConfig;
  }

  async getStatInfo() {
    const cmcMap: Record<string, any[]> = {};
    const tokens = await this.prismaService.token.findMany();
    tokens.forEach((e) => {
      if (e.address) {
        cmcMap[e.address.toLowerCase()] = cmcMap[e.address.toLowerCase()] || [];
        cmcMap[e.address.toLowerCase()].push({
          platform: e.platformSlug,
          address: e.address,
        });
      }
    });

    const llamaMap: Record<string, any[]> = {};
    const llamaTokens = await this.prismaService.llamaToken.findMany();
    llamaTokens.forEach((e) => {
      if (e.address) {
        llamaMap[e.address.toLowerCase()] = llamaMap[e.address.toLowerCase()] || [];
        llamaMap[e.address.toLowerCase()].push({
          platform: e.platform,
          chainId: e.chainId,
          address: e.address,
          price: e.price,
        });
      }
    });

    const cBridge = await this.cache.get<ICBridgeTransferConfig>(CACHE_KEY.CBRIDGE_CONFIG);
    const deBridge = await this.cache.get<IDeBridgeTransferConfig>(CACHE_KEY.DEBRIDGE_CONFIG);
    const stargate = await this.cache.get<IStargateTransferConfig>(CACHE_KEY.STARGATE_CONFIG);
    const meson = await this.cache.get<IMesonTransferConfig>(CACHE_KEY.MESON_CONFIG);

    const tokenCountMap: Record<string, number> = {};
    const bridgeMap: Record<number, string[]> = {};
    const addToBridgeMap = (
      _chainId: number | string,
      tokenAddress: string,
      bridgeType: BridgeType,
    ) => {
      const chainId = Number(_chainId);
      if (!chainId) return;

      bridgeMap[chainId] = bridgeMap[chainId] || [];
      if (!bridgeMap[chainId].includes(tokenAddress?.toLowerCase())) {
        bridgeMap[chainId].push(tokenAddress?.toLowerCase());
        tokenCountMap[bridgeType] = tokenCountMap[bridgeType] ?? 0;
        tokenCountMap[bridgeType]++;
      }
    };

    Object.entries(cBridge.chain_token).forEach(([key, { token }]) => {
      token.forEach((e) => {
        addToBridgeMap(key, e.token.address, 'cBridge');
      });
    });
    cBridge.pegged_pair_configs.forEach((e) => {
      addToBridgeMap(e.org_chain_id, e.org_token.token.address, 'cBridge');
      addToBridgeMap(e.pegged_chain_id, e.pegged_token.token.address, 'cBridge');
    });

    Object.entries(deBridge.tokens).forEach(([key, tokens]) => {
      tokens.forEach((e) => {
        addToBridgeMap(key, e.address, 'deBridge');
      });
    });

    stargate.filter((e) => {
      addToBridgeMap(e.chainId, e.token.address, 'stargate');
    });

    meson.forEach((chain) => {
      const chainId = chain.chainId === 'tron' ? TRON_CHAIN_ID : chain.chainId;
      chain.tokens.filter((e) => {
        addToBridgeMap(chainId, e.addr ?? EVM_NATIVE_TOKEN_ADDRESS, 'meson');
      });
    });

    const cmcSlugMap: Record<any, any> = {};
    Object.entries(bridgeMap).forEach(([key, tokens]) => {
      const chainId = Number(key);

      tokens.forEach((e) => {
        if (cmcMap[e]) {
          cmcMap[e].forEach((e) => {
            cmcSlugMap[chainId] = cmcSlugMap[chainId] ?? [];
            if (!cmcSlugMap[chainId].includes(e.platform)) {
              cmcSlugMap[chainId].push(e.platform);
            }
          });
        }
      });
    });

    return {
      tokenCountMap,
      cmcSlugMap,
      cmcMap,
      llamaMap,
    };
  }
}
