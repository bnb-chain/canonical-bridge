import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { JOB_KEY, Queues, Tasks, TOKEN_REQUEST_LIMIT } from '@/common/constants';
import { Job, Queue } from 'bullmq';
import { ITokenJob } from '@/module/token/token.interface';
import { Web3Service } from '@/shared/web3/web3.service';
import { TokenService } from '@/module/token/token.service';

@Processor(Queues.SyncToken)
export class TokenProcessor extends WorkerHost {
  private logger = new Logger(TokenProcessor.name);

  constructor(
    private web3Service: Web3Service,
    private tokenService: TokenService,
    @InjectQueue(Queues.SyncToken) private syncToken: Queue<ITokenJob>,
  ) {
    super();
  }

  async process(job: Job<ITokenJob>) {
    switch (job.name) {
      case Tasks.fetchToken:
        return this.fetchTokens(job);
      case Tasks.fetchPrice:
        return this.fetchPrice(job);
      default:
    }
  }

  async fetchTokens(job: Job<ITokenJob>) {
    const tokens = await this.web3Service.getCryptoCurrencyMap(job.data);

    if (tokens.length === TOKEN_REQUEST_LIMIT) {
      const start = job.data.start + TOKEN_REQUEST_LIMIT;
      await this.syncToken.add(
        Tasks.fetchToken,
        { start },
        { jobId: `${JOB_KEY.CORN_TOKEN_PREFIX}${start}`, removeOnComplete: true },
      );
    }

    this.tokenService.syncTokens(tokens);
  }

  async fetchPrice(job: Job<ITokenJob>) {
    const tokens = await this.web3Service.getCryptoCurrencyQuotes(job.data.ids);

    await this.tokenService.syncTokenPrice(tokens);
  }
}
