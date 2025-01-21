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
      Tasks.fetchCmcTokens,
      { start: 1 },
      { jobId: `${JOB_KEY.CORN_TOKEN_PREFIX}1`, removeOnComplete: true },
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async syncCoingeckoTokens() {
    this.logger.log('syncCoingeckoTokens');
    await this.syncToken.add(Tasks.fetchCoingeckoTokens, null, {
      jobId: Tasks.fetchCoingeckoTokens,
      removeOnComplete: true,
    });
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async syncCmcTokenPrice() {
    this.logger.log('syncCmcTokenPrice');
    const ids = await this.tokensService.getCmcTokenIdsForPriceJob();

    if (!ids?.length) return;
    await this.syncToken.add(
      Tasks.fetchCmcPrice,
      { ids },
      { jobId: `${JOB_KEY.CORN_PRICE_PREFIX}${ids}`, removeOnComplete: true },
    );
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async syncCoingeckoTokenPrice() {
    this.logger.log('syncCoingeckoTokenPrice');
    const { tokens, keyMap } = await this.tokensService.getLlamaTokenIdsForPriceJob();

    if (!tokens?.length) return;
    await this.syncToken.add(
      Tasks.fetchLlamaPrice,
      { ids: tokens, keyMap },
      { jobId: `${JOB_KEY.CORN_PRICE_PREFIX}${tokens}`, removeOnComplete: true },
    );
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async syncTokenConfig() {
    this.logger.log('syncTokenConfig');
    await this.syncToken.add(Tasks.cacheCmcConfig, null, {
      jobId: Tasks.cacheCmcConfig,
      removeOnComplete: true,
    });
    await this.syncToken.add(Tasks.cacheLlamaConfig, null, {
      jobId: Tasks.cacheLlamaConfig,
      removeOnComplete: true,
    });
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async syncTokenConfigV2() {
    this.logger.log('syncTokenConfigV2');
    await this.syncToken.add(Tasks.cacheCmcConfigV2, null, {
      jobId: Tasks.cacheCmcConfigV2,
      removeOnComplete: true,
    });
    await this.syncToken.add(Tasks.cacheLlamaConfigV2, null, {
      jobId: Tasks.cacheLlamaConfigV2,
      removeOnComplete: true,
    });
  }

  async onModuleInit() {
    await this.syncCmcTokens();
    await this.syncCoingeckoTokens();
    await this.syncTokenConfig();
    await this.syncTokenConfigV2();
    const jobs = await this.syncToken.getFailed();
    jobs.forEach((job) => job?.retry());
    if (!jobs.length) return;
    this.logger.log(`Retrying failed token jobs[${jobs.length}]`);
  }
}
