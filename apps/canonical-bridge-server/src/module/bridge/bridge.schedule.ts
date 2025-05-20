import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queues, Tasks } from '@/common/constants';
import { Queue } from 'bullmq';

@Injectable()
export class BridgeSchedule implements OnModuleInit {
  private logger = new Logger(BridgeSchedule.name);

  constructor(@InjectQueue(Queues.SyncBridge) private syncBridge: Queue) {}

  @Cron(CronExpression.EVERY_3_HOURS)
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
    await this.syncBridge.add(Tasks.fetchStargate, null, {
      jobId: Tasks.fetchStargate,
      removeOnComplete: true,
    });
    await this.syncBridge.add(Tasks.fetchMeson, null, {
      jobId: Tasks.fetchMeson,
      removeOnComplete: true,
    });
    await this.syncBridge.add(Tasks.fetchMayan, null, {
      jobId: Tasks.fetchMayan,
      removeOnComplete: true,
    });
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async syncFilteredBridgeInfo() {
    this.logger.log('syncFilteredBridgeInfo');
    await this.syncBridge.add(Tasks.filterCBridge, null, {
      jobId: Tasks.filterCBridge,
      removeOnComplete: true,
    });
    await this.syncBridge.add(Tasks.filterDeBridge, null, {
      jobId: Tasks.filterDeBridge,
      removeOnComplete: true,
    });
    await this.syncBridge.add(Tasks.filterStargate, null, {
      jobId: Tasks.filterStargate,
      removeOnComplete: true,
    });
    await this.syncBridge.add(Tasks.filterMeson, null, {
      jobId: Tasks.filterMeson,
      removeOnComplete: true,
    });
    await this.syncBridge.add(Tasks.filterMayan, null, {
      jobId: Tasks.filterMayan,
      removeOnComplete: true,
    });
  }

  async onModuleInit() {
    await this.syncBridgeInfo();
    await this.syncFilteredBridgeInfo();
    const jobs = await this.syncBridge.getFailed();
    jobs.forEach((job) => job?.retry());
    if (!jobs.length) return;
    this.logger.log(`Retrying failed bridge jobs[${jobs.length}]`);
  }
}
