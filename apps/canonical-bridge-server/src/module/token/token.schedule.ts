import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JOB_KEY, Queues, Tasks } from '@/common/constants';
import { Queue } from 'bullmq';
import { ITokenJob } from '@/module/token/token.interface';
import { InjectQueue } from '@nestjs/bullmq';
import { TokenService } from '@/module/token/token.service';

@Injectable()
export class TokenSchedule implements OnModuleInit {
  private logger = new Logger(TokenSchedule.name);

  constructor(
    @InjectQueue(Queues.SyncToken) private syncToken: Queue<ITokenJob>,
    private tokensService: TokenService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncCmcTokens() {
    this.logger.log('syncCmcTokens');
    await this.syncToken.add(
      Tasks.fetchToken,
      { start: 1 },
      { jobId: `${JOB_KEY.CORN_TOKEN_PREFIX}1`, removeOnComplete: true },
    );
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async syncCmcTokenPrice() {
    this.logger.log('syncCmcTokenPrice');
    const ids = await this.tokensService.getJobIds();
    if (!ids) return;
    await this.syncToken.add(
      Tasks.fetchPrice,
      { ids },
      { jobId: `${JOB_KEY.CORN_PRICE_PREFIX}${ids}`, removeOnComplete: true },
    );
  }

  async onModuleInit() {
    await this.syncCmcTokens();
    const jobs = await this.syncToken.getFailed();
    jobs.forEach((job) => job?.retry());
    if (!jobs.length) return;
    this.logger.log(`Retrying failed token jobs[${jobs.length}]`);
  }
}
