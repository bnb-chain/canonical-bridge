import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { CACHE_KEY, JOB_KEY, Queues, Tasks, TOKEN_REQUEST_LIMIT } from '@/common/constants';
import { Job, Queue } from 'bullmq';
import { ITokenJob } from '@/module/token/token.interface';
import { Web3Service } from '@/shared/web3/web3.service';
import { TokenService } from '@/module/token/token.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Processor(Queues.SyncToken)
export class TokenProcessor extends WorkerHost {
  private logger = new Logger(TokenProcessor.name);

  constructor(
    private web3Service: Web3Service,
    private tokenService: TokenService,
    @Inject(CACHE_MANAGER) private cache: Cache,
    @InjectQueue(Queues.SyncToken) private syncToken: Queue<ITokenJob>,
  ) {
    super();
  }

  async process(job: Job<ITokenJob>) {
    switch (job.name) {
      case Tasks.fetchCoingeckoToken:
        return this.fetchCoingeckoToken();
      case Tasks.fetchToken:
        return this.fetchTokens(job);
      case Tasks.fetchPrice:
        return this.fetchPrice(job);
      case Tasks.fetchLlamaPrice:
        return this.fetchLlamaPrice(job);
      case Tasks.cacheCmcConfig:
        return this.cacheCmcConfig();
      case Tasks.cacheLlamaConfig:
        return this.cacheLlamaConfig();
      default:
    }
  }

  async cacheLlamaConfig() {
    const tokens = await this.tokenService.getAllCoingeckoTokens();
    const config = tokens
      .filter((t) => t.price)
      .reduce((r, c) => {
        const { symbol, address, platform } = c;
        if (!symbol) return r;
        const _symbol = symbol.toLowerCase();

        if (platform === 'ethereum') {
          r[_symbol] = { price: c.price, decimals: c.decimals };
        }

        const key = !address ? _symbol : `${_symbol}:${address.toLowerCase()}`;
        r[key] = { price: c.price, decimals: c.decimals };

        return r;
      }, {});

    await this.cache.set(`${CACHE_KEY.LLAMA_CONFIG}`, config);
    return config;
  }

  async cacheCmcConfig() {
    const tokens = await this.tokenService.getAllTokens();
    const config = tokens
      .filter((t) => t.price)
      .reduce((r, c) => {
        const { symbol, address, platformName } = c;
        if (!symbol) return r;
        const _symbol = symbol.toLowerCase();

        if (platformName === 'Ethereum') {
          r[_symbol] = { price: c.price, id: c.id };
        }

        const key = !address ? _symbol : `${_symbol}:${address.toLowerCase()}`;
        r[key] = { price: c.price, id: c.id };
        return r;
      }, {});

    await this.cache.set(`${CACHE_KEY.CMC_CONFIG}`, config);
    return config;
  }

  async fetchCoingeckoToken() {
    const getPlatforms = this.web3Service.getAssetPlatforms();
    const getCoins = this.web3Service.getCoinList();

    const platforms = await getPlatforms;
    const coins = await getCoins;

    if (!platforms || !coins) return;

    const mapping = platforms
      .filter((p) => !!p.shortname)
      .map((p) => ({ ...p, shortname: p.shortname.toLowerCase().replaceAll(' ', '-') }))
      .filter((p) => p.id !== p.shortname)
      .reduce(
        (r, c) => ({ ...r, [c.id]: c.shortname, [c.shortname]: c.id }),
        {} as Record<string, string>,
      );

    await this.cache.set(`${CACHE_KEY.PLATFORM_MAPPING}`, mapping);
    this.tokenService.syncCoingeckoTokens(coins, platforms);
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

  async fetchLlamaPrice(job: Job<ITokenJob>) {
    const tokens = await this.web3Service.getLlamaTokenPrice(job.data.ids);

    await this.tokenService.syncLlamaTokenPrice(tokens.coins, job.data.keyMap);
  }
}
