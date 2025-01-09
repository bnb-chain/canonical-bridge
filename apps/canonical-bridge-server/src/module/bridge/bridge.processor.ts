import { CACHE_KEY, Queues, Tasks, TIME } from '@/common/constants';
import { Processor, WorkerHost } from '@nestjs/bullmq';
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
    private web3Service: Web3Service,
    private bridgeService: BridgeService,
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

  async filterCBridge() {
    const config = await this.bridgeService.getFilteredCBridgeConfig();
    if (!config) return;
    await this.cache.set(`${CACHE_KEY.FIELDED_CBRIDGE_CONFIG}`, config, TIME.DAY);
  }

  async filterDeBridge() {
    const config = await this.bridgeService.getFilteredDeBridgeConfig();
    if (!config) return;
    await this.cache.set(`${CACHE_KEY.FIELDED_DEBRIDGE_CONFIG}`, config, TIME.DAY);
  }

  async filterStargate() {
    const config = await this.bridgeService.getFilteredStargateConfig();
    if (!config) return;
    await this.cache.set(`${CACHE_KEY.FIELDED_STARGATE_CONFIG}`, config, TIME.DAY);
  }

  async filterMeson() {
    const config = await this.bridgeService.getFilteredMesonConfig();
    if (!config) return;
    await this.cache.set(`${CACHE_KEY.FIELDED_MESON_CONFIG}`, config, TIME.DAY);
  }
}
