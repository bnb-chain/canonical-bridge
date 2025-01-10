import { CACHE_KEY, Queues, Tasks, TIME } from '@/common/constants';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Web3Service } from '@/shared/web3/web3.service';

@Processor(Queues.SyncConfig)
export class ConfigProcessor extends WorkerHost {
  private logger = new Logger(ConfigProcessor.name);

  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private web3Service: Web3Service,
  ) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case Tasks.fetchCmsChains:
        return this.fetchCmsChains();
      case Tasks.fetchCmsTransferConfig:
        return this.fetchCmsTransferConfig();
      case Tasks.fetchCmsGlobalConfig:
        return this.fetchCmsGlobalConfig();
      default:
    }
  }

  async fetchCmsChains() {
    const config = await this.web3Service.getCmsChains();
    if (!config) return;
    await this.cache.set(`${CACHE_KEY.CHAINS_CONFIG}`, config, TIME.DAY);
  }

  async fetchCmsTransferConfig() {
    const config = await this.web3Service.getCmsTransferConfig();
    if (!config) return;
    await this.cache.set(`${CACHE_KEY.TRANSFER_CONFIG}`, config, TIME.DAY);
  }

  async fetchCmsGlobalConfig() {
    const config = await this.web3Service.getCmsGlobalConfig();
    if (!config) return;
    await this.cache.set(`${CACHE_KEY.GLOBAL_CONFIG}`, config, TIME.DAY);
  }
}
