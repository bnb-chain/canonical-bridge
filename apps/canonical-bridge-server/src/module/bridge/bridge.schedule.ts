import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queues, Tasks } from '@/common/constants';
import { Queue } from 'bullmq';

@Injectable()
export class BridgeSchedule implements OnModuleInit {
  private logger = new Logger(BridgeSchedule.name);

  constructor(@InjectQueue(Queues.SyncBridge) private syncBridge: Queue) {}

  @Cron(CronExpression.EVERY_HOUR)
  async syncBridgeInfo() {
    this.logger.log('syncBridgeInfo');
    await this.syncBridge.add(Tasks.fetchCbridge, null, {
      jobId: Tasks.fetchCbridge,
      removeOnComplete: true,
    });
    await this.syncBridge.add(Tasks.fetchDebridge, null, {
      jobId: Tasks.fetchDebridge,
      removeOnComplete: true,
    });
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async syncCmcConfig() {
    this.logger.log('syncCmcConfig');
    await this.syncBridge.add(Tasks.cacheCmcConfig, null, {
      jobId: Tasks.cacheCmcConfig,
      removeOnComplete: true,
    });
  }

  async onModuleInit() {
    await this.syncBridgeInfo();
    await this.syncCmcConfig();
    const jobs = await this.syncBridge.getFailed();
    jobs.forEach((job) => job?.retry());
    if (!jobs.length) return;
    this.logger.log(`Retrying failed bridge jobs[${jobs.length}]`);
  }
}
