import { CACHE_KEY, Queues, Tasks, TIME } from '@/common/constants';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { Web3Service } from '@/shared/web3/web3.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ITokenPriceRecord } from '@/module/token/token.interface';
import { isEmpty } from 'lodash';
import {
  EVM_NATIVE_TOKEN_ADDRESS,
  ICBridgeToken,
  ICBridgeTransferConfig,
  IDeBridgeToken,
  IDeBridgeTransferConfig,
  IMesonChain,
  IMesonTransferConfig,
  isNativeToken,
  IStargateTransferConfig,
  TRON_CHAIN_ID,
  IMayanChain,
  IMayanTransferConfig,
  IMayanToken,
  SOLANA_CHAIN_ID,
} from '@bnb-chain/canonical-bridge-sdk';
import { UtilService } from '@/shared/util/util.service';
import { sleep } from '@/common/utils';

@Processor(Queues.SyncBridge)
export class BridgeProcessor extends WorkerHost {
  private logger = new Logger(BridgeProcessor.name);

  constructor(
    private web3Service: Web3Service,
    private utilService: UtilService,
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
      case Tasks.fetchMayan:
        return this.fetchMayan();

      case Tasks.filterCBridge:
        return this.filterCBridge();
      case Tasks.filterDeBridge:
        return this.filterDeBridge();
      case Tasks.filterStargate:
        return this.filterStargate();
      case Tasks.filterMeson:
        return this.filterMeson();
      case Tasks.filterMayan:
        return this.filterMayan();
      default:
    }
  }

  async fetchDeBridge() {
    const config = await this.web3Service.getDebridgeChains();
    if (!config) return;

    const tokenMap: Record<string, IDeBridgeToken[]> = {};
    const preConfig = await this.cache.get<IDeBridgeTransferConfig>(`${CACHE_KEY.DEBRIDGE_CONFIG}`);

    for (const chain of config.chains) {
      // Prevent failure by sending too many requests in a short time
      await sleep(2000);
      const data = await this.web3Service.getDebridgeChainTokens(chain.chainId);
      if (data) {
        tokenMap[chain.chainId] = Object.values(data.tokens);
      } else {
        tokenMap[chain.chainId] = preConfig?.tokens?.[chain.chainId]; // use old data
      }
    }

    const data = { chains: config.chains, tokens: tokenMap };

    await this.cache.set(`${CACHE_KEY.DEBRIDGE_CONFIG}`, data, TIME.WEEK);
  }

  async fetchCBridge() {
    const config = await this.web3Service.getTransferConfigsForAll();
    if (!config) return;
    await this.cache.set(`${CACHE_KEY.CBRIDGE_CONFIG}`, config, TIME.WEEK);
  }

  async fetchStargate() {
    const config = await this.web3Service.getStargateConfigs();
    if (!config) return;
    await this.cache.set(`${CACHE_KEY.STARGATE_CONFIG}`, config, TIME.WEEK);
  }

  async fetchMeson() {
    const config = await this.web3Service.getMesonConfigs();
    if (!config) return;
    await this.cache.set(`${CACHE_KEY.MESON_CONFIG}`, config, TIME.WEEK);
  }

  async fetchMayan() {
    const config = await this.web3Service.getMayanConfigs();
    if (!config) return;
    await this.cache.set(CACHE_KEY.MAYAN_CONFIG, config, TIME.WEEK);
  }

  private updateDeBridgeConfigManually(config?: IDeBridgeTransferConfig) {
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
      this.cache.get<ITokenPriceRecord>(CACHE_KEY.CMC_CONFIG_V2),
      this.cache.get<ITokenPriceRecord>(CACHE_KEY.LLAMA_CONFIG_V2),
    ]);

    return {
      cmcPrices: cmcRes.status === 'fulfilled' ? cmcRes.value : {},
      llamaPrices: llamaRes.status === 'fulfilled' ? llamaRes.value : {},
    };
  }

  public hasTokenPrice({
    cmcPrices = {},
    llamaPrices = {},
    chainId,
    tokenAddress,
    tokenSymbol,
  }: {
    cmcPrices: ITokenPriceRecord;
    llamaPrices: ITokenPriceRecord;
    chainId: number;
    tokenAddress: string;
    tokenSymbol: string;
  }) {
    if (isEmpty(cmcPrices) && isEmpty(llamaPrices)) {
      return true;
    }

    const chainInfo = this.utilService.getChainConfigByChainId(chainId);
    if (!chainInfo) {
      return false;
    }

    let key: string | undefined;
    const isNative = isNativeToken(tokenAddress, chainInfo.chainType);
    if (isNative) {
      key = `${chainId}`;
    } else {
      if (chainInfo.chainType === 'evm') {
        key = `${chainId}:${tokenAddress.toLowerCase()}`;
      } else {
        key = `${chainId}:${tokenAddress}`;
      }
    }

    const symbolKey = `1:${tokenSymbol?.toLowerCase()}`;
    const price =
      cmcPrices[key] ?? llamaPrices[key] ?? cmcPrices[symbolKey] ?? llamaPrices[symbolKey];

    return !!price;
  }

  async filterCBridge() {
    const config = await this.cache.get<ICBridgeTransferConfig>(CACHE_KEY.CBRIDGE_CONFIG);
    if (!config) return;

    const priceConfig = await this.getPriceConfig();

    const chainToken: Record<number, { token: ICBridgeToken[] }> = {};
    Object.entries(config.chain_token).forEach(([key, { token }]) => {
      const chainId = Number(key);
      chainToken[chainId] = { token: [] };
      chainToken[chainId].token = token.filter((e) => {
        return this.hasTokenPrice({
          ...priceConfig,
          tokenAddress: e.token.address,
          tokenSymbol: e.token.symbol,
          chainId,
        });
      });
    });

    const peggedPairConfigs: ICBridgeTransferConfig['pegged_pair_configs'] =
      config.pegged_pair_configs.filter((e) => {
        const orgHasPrice = this.hasTokenPrice({
          ...priceConfig,
          tokenAddress: e.org_token.token.address,
          tokenSymbol: e.org_token.token.symbol,
          chainId: e.org_chain_id,
        });

        const peggedHasPrice = this.hasTokenPrice({
          ...priceConfig,
          tokenAddress: e.pegged_token.token.address,
          tokenSymbol: e.pegged_token.token.symbol,
          chainId: e.pegged_chain_id,
        });

        return orgHasPrice && peggedHasPrice;
      });

    const finalConfig: ICBridgeTransferConfig = {
      ...config,
      chain_token: chainToken,
      pegged_pair_configs: peggedPairConfigs,
    };

    await this.cache.set(`${CACHE_KEY.FILTERED_CBRIDGE_CONFIG}`, finalConfig, TIME.DAY);
  }

  async filterDeBridge() {
    const _config = await this.cache.get<IDeBridgeTransferConfig>(CACHE_KEY.DEBRIDGE_CONFIG);
    const config = this.updateDeBridgeConfigManually(_config);
    if (!config) return config;

    const priceConfig = await this.getPriceConfig();
    const chainTokens: Record<number, IDeBridgeToken[]> = {};

    Object.entries(config.tokens).forEach(([key, tokens]) => {
      const chainId = Number(key);
      chainTokens[chainId] = tokens.filter((e) => {
        return this.hasTokenPrice({
          ...priceConfig,
          tokenAddress: e.address,
          tokenSymbol: e.symbol,
          chainId,
        });
      });
    });

    const finalConfig: IDeBridgeTransferConfig = {
      ...config,
      tokens: chainTokens,
    };

    await this.cache.set(`${CACHE_KEY.FILTERED_DEBRIDGE_CONFIG}`, finalConfig, TIME.DAY);
  }

  async filterStargate() {
    const config = await this.cache.get<IStargateTransferConfig>(CACHE_KEY.STARGATE_CONFIG);
    if (!config) return config;

    const priceConfig = await this.getPriceConfig();

    const finalConfig = config.filter((e) => {
      return this.hasTokenPrice({
        ...priceConfig,
        tokenAddress: e.token.address,
        tokenSymbol: e.token.symbol,
        chainId: e.chainId,
      });
    });

    await this.cache.set(`${CACHE_KEY.FILTERED_STARGATE_CONFIG}`, finalConfig, TIME.DAY);
  }

  async filterMeson() {
    const config = await this.cache.get<IMesonTransferConfig>(CACHE_KEY.MESON_CONFIG);
    if (!config) return config;

    const priceConfig = await this.getPriceConfig();

    const finalConfig: IMesonChain[] = [];
    config.forEach((chain) => {
      const tokens = chain.tokens.filter((e) => {
        return this.hasTokenPrice({
          ...priceConfig,
          tokenAddress: e.addr ?? EVM_NATIVE_TOKEN_ADDRESS,
          tokenSymbol: e.symbol,
          chainId: chain.chainId === 'tron' ? TRON_CHAIN_ID : Number(chain.chainId),
        });
      });

      if (tokens?.length) {
        finalConfig.push({
          ...chain,
          tokens,
        });
      }
    });

    await this.cache.set(`${CACHE_KEY.FILTERED_MESON_CONFIG}`, finalConfig, TIME.DAY);
  }

  async filterMayan() {
    const config = await this.cache.get<IMayanTransferConfig>(CACHE_KEY.MAYAN_CONFIG);
    if (!config) return;

    const priceConfig = await this.getPriceConfig();

    // Filter tokens for each chain
    const filteredTokens: Record<string, IMayanToken[]> = {};
    Object.entries(config.tokens).forEach(([nameId, tokens]) => {
      filteredTokens[nameId] = tokens.filter((token) => {
        return this.hasTokenPrice({
          ...priceConfig,
          tokenAddress: token.contract,
          tokenSymbol: token.symbol,
          chainId: nameId === 'solana' ? SOLANA_CHAIN_ID : token.chainId,
        });
      });
    });

    // Filter chains to include only those with non-empty token lists
    const filteredChains: IMayanChain[] = config.chains.filter((chain) => {
      const chainTokens = filteredTokens[chain.nameId];
      return chainTokens && chainTokens.length > 0;
    });

    // Create the final filtered configuration
    const finalConfig: IMayanTransferConfig = {
      chains: filteredChains,
      tokens: filteredTokens,
    };

    // Cache the filtered configuration
    await this.cache.set(`${CACHE_KEY.FILTERED_MAYAN_CONFIG}`, finalConfig, TIME.DAY);
  }
}
