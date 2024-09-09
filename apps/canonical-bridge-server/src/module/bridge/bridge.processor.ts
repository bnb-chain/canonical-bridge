import { CACHE_KEY, Queues, Tasks } from '@/common/constants';
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { Web3Service } from '@/shared/web3/web3.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { IDebridgeToken } from '@/shared/web3/web3.interface';
import { BridgeService } from '@/module/bridge/bridge.service';

@Processor(Queues.SyncBridge)
export class BridgeProcessor extends WorkerHost {
  private logger = new Logger(BridgeProcessor.name);

  constructor(
    @InjectQueue(Queues.SyncBridge) private syncBridge: Queues.SyncBridge,
    private web3Service: Web3Service,
    @Inject(CACHE_MANAGER) private cache: Cache,
    private bridgeService: BridgeService,
  ) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case Tasks.fetchCbridge:
        return this.fetchCBridge();
      case Tasks.fetchDebridge:
        return this.fetchDeBridge();
      case Tasks.cacheCmcConfig:
        return this.cacheCmcConfig();
      default:
    }
  }

  async cacheCmcConfig() {
    const tokens = await this.bridgeService.getAllTokens();
    const config = tokens
      .filter((t) => t.price)
      .reduce(
        (r, c) => {
          const { symbol, address } = c;
          if (symbol && !address)
            return { ...r, [symbol.toLowerCase()]: { price: c.price, id: c.id } };
          return {
            ...r,
            [`${symbol.toLowerCase()}:${address.toLowerCase()}`]: { price: c.price, id: c.id },
          };
        },
        {} as Record<string, string>,
      );
    await this.cache.set(`${CACHE_KEY.CMC_CONFIG}`, config);
    return config;
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

    await this.cache.set(`${CACHE_KEY.DEBRIDGE_CONFIG}`, data);
  }

  async fetchCBridge() {
    const config = await this.web3Service.getTransferConfigsForAll();
    if (!config) return;
    await this.cache.set(`${CACHE_KEY.CBRIDGE_CONFIG}`, config);
  }
}
