import { CACHE_KEY, Queues, Tasks, TIME } from '@/common/constants';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { Web3Service } from '@/shared/web3/web3.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  IDebridgeConfig,
  IDebridgeToken,
  IMesonChain,
  IStargateBridgeTokenInfo,
  ITransferConfigsForAll,
  ITransferToken,
} from '@/shared/web3/web3.interface';
import { ITokenPriceRecord } from '@/module/token/token.interface';
import { isEmpty } from 'lodash';

@Processor(Queues.SyncBridge)
export class BridgeProcessor extends WorkerHost {
  private logger = new Logger(BridgeProcessor.name);

  constructor(
    private web3Service: Web3Service,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case Tasks.fetchCbridge:
        return this.fetchCBridge();
      case Tasks.fetchDebridge:
        return this.fetchDeBridge();
      case Tasks.fetchMeson:
        return this.fetchMeson();
      case Tasks.fetchStargate:
        return this.fetchStargate();

      case Tasks.filterCBridge:
        return this.filterCBridge();
      case Tasks.filterDeBridge:
        return this.filterDeBridge();
      case Tasks.filterStargate:
        return this.filterStargate();
      case Tasks.filterMeson:
        return this.filterMeson();
      default:
    }
  }

  async fetchDeBridge() {
    const config = await this.web3Service.getDebridgeChains();

    if (!config) return;

    const tokenMap: Record<string, IDebridgeToken[]> = {};

    for (const chain of config.chains) {
      const data = await this.web3Service.getDebridgeChainTokens(chain.chainId);
      tokenMap[chain.chainId] = Object.values(data.tokens);
    }

    const data = { chains: config.chains, tokens: tokenMap };

    await this.cache.set(`${CACHE_KEY.DEBRIDGE_CONFIG}`, data, TIME.DAY);
  }

  async fetchCBridge() {
    const config = await this.web3Service.getTransferConfigsForAll();
    if (!config) return;
    await this.cache.set(`${CACHE_KEY.CBRIDGE_CONFIG}`, config, TIME.DAY);
  }

  async fetchStargate() {
    const config = await this.web3Service.getStargateConfigs();
    if (!config) return;
    await this.cache.set(`${CACHE_KEY.STARGATE_CONFIG}`, config, TIME.DAY);
  }

  async fetchMeson() {
    const config = await this.web3Service.getMesonConfigs();
    if (!config) return;
    await this.cache.set(`${CACHE_KEY.MESON_CONFIG}`, config, TIME.DAY);
  }

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

  async filterCBridge() {
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

    await this.cache.set(`${CACHE_KEY.FIELDED_CBRIDGE_CONFIG}`, finalConfig, TIME.DAY);
  }

  async filterDeBridge() {
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

    await this.cache.set(`${CACHE_KEY.FIELDED_DEBRIDGE_CONFIG}`, finalConfig, TIME.DAY);
  }

  async filterStargate() {
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

    await this.cache.set(`${CACHE_KEY.FIELDED_STARGATE_CONFIG}`, finalConfig, TIME.DAY);
  }

  async filterMeson() {
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

    await this.cache.set(`${CACHE_KEY.FIELDED_MESON_CONFIG}`, finalConfig, TIME.DAY);
  }
}
