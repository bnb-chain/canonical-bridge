import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queues, Tasks } from '@/common/constants';
import { Queue } from 'bullmq';

@Injectable()
export class ConfigSchedule implements OnModuleInit {
  private logger = new Logger(ConfigSchedule.name);

  constructor(@InjectQueue(Queues.SyncConfig) private syncConfig: Queue) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async syncCmsConfig() {
    // this.logger.log('syncCmsConfig');
    await this.syncConfig.add(Tasks.fetchCmsChains, null, {
      jobId: Tasks.fetchCmsChains,
      removeOnComplete: true,
    });
    await this.syncConfig.add(Tasks.fetchCmsTransferConfig, null, {
      jobId: Tasks.fetchCmsTransferConfig,
      removeOnComplete: true,
    });
  }

  async onModuleInit() {
    await this.syncCmsConfig();
    const jobs = await this.syncConfig.getFailed();
    jobs.forEach((job) => job?.retry());
    if (!jobs.length) return;
    this.logger.log(`Retrying failed config jobs[${jobs.length}]`);
  }
}
