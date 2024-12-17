import { CACHE_KEY, Queues, Tasks } from '@/common/constants';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { Web3Service } from '@/shared/web3/web3.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { IDebridgeToken } from '@/shared/web3/web3.interface';

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

    await this.cache.set(`${CACHE_KEY.DEBRIDGE_CONFIG}`, data);
  }

  async fetchCBridge() {
    const config = await this.web3Service.getTransferConfigsForAll();
    if (!config) return;
    await this.cache.set(`${CACHE_KEY.CBRIDGE_CONFIG}`, config);
  }

  async fetchStargate() {
    const config = await this.web3Service.getStargateConfigs();
    if (!config) return;
    await this.cache.set(`${CACHE_KEY.STARGATE_CONFIG}`, config);
  }

  async fetchMeson() {
    const config = await this.web3Service.getMesonConfigs();
    if (!config) return;
    await this.cache.set(`${CACHE_KEY.MESON_CONFIG}`, config);
  }
}
