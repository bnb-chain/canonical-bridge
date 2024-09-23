import { Inject, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '@/shared/database/database.service';
import {
  IAssetPlatform,
  ICoin,
  ICoinPrice,
  ICryptoCurrencyMapEntity,
  ICryptoCurrencyQuoteEntity,
} from '@/shared/web3/web3.interface';
import { CACHE_KEY, PRICE_REQUEST_LIMIT } from '@/common/constants';
import { get, isEmpty } from 'lodash';
import { Prisma } from '@prisma/client';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class TokenService {
  private logger = new Logger(TokenService.name);

  constructor(
    private databaseService: DatabaseService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async syncTokens(tokens: ICryptoCurrencyMapEntity[]) {
    const payload = tokens.map((token) => ({
      id: token.id,
      rank: token.rank,
      name: token.name,
      symbol: token.symbol,
      slug: token.slug,
      platformSlug: token.platform?.slug,
      platformName: token.platform?.name,
      address: token.platform?.token_address,
    }));

    return this.databaseService.createTokens(payload);
  }

  async syncCoingeckoTokens(coins: ICoin[], platforms: IAssetPlatform[]) {
    const pm = platforms.reduce(
      (r, c) => ({
        ...r,
        [c.id]: c.chain_identifier,
      }),
      {} as Record<string, number>,
    );

    const allTokens: Prisma.LlamaTokenCreateManyInput[] = [];
    coins.forEach((coin) => {
      const native = isEmpty(coin.platforms);
      const base = { id: coin.id, name: coin.name, symbol: coin.symbol, chainId: pm[coin.id] };
      if (native) {
        allTokens.push(base);
      } else {
        Object.entries(coin.platforms).forEach(([k, v]) => {
          allTokens.push({ ...base, platform: k, address: v, chainId: pm[k] });
        });
      }
    });

    return this.databaseService.createCoingeckoTokens(allTokens);
  }

  async syncTokenPrice(tokens: ICryptoCurrencyQuoteEntity[]) {
    const payload = tokens.map((token) => ({
      id: token.id,
      price: token.quote.USD?.price,
    }));

    return this.databaseService.updateTokens(payload);
  }

  async getJobIds() {
    const tokens = await this.databaseService.getTokens(PRICE_REQUEST_LIMIT);
    return tokens.map((token) => token.id).join(',');
  }

  async syncLlamaTokenPrice(tokens: Record<string, ICoinPrice>, keyMap: Record<string, string>) {
    const _tokens: ICoinPrice[] = [];

    Object.entries(keyMap).forEach(([key, v]) => {
      const data = tokens[key];
      _tokens.push({ id: v, price: data?.price, decimals: data?.decimals });
    });

    return this.databaseService.updateLlamaTokens(_tokens);
  }

  async getLlamaJobIds() {
    const tokens = await this.databaseService.getCoingeckoTokens(PRICE_REQUEST_LIMIT / 2);
    const keyMap: Record<string, string> = {};
    const platformMapping = await this.cache.get<Record<string, string>>(
      `${CACHE_KEY.PLATFORM_MAPPING}`,
    );
    const _tokens = tokens.map((l) => {
      if (l.platform) {
        const platform = get(platformMapping, l.platform, l.platform);
        const key = `${platform}:${l.address}`;
        keyMap[key] = l.id;
        return key.replaceAll('/', '%2F');
      }

      const key = `coingecko:${l.id}`;
      keyMap[key] = l.id;
      return key;
    });

    return { tokens: _tokens.join(','), keyMap };
  }

  async getAllTokens() {
    return this.databaseService.getAllTokens();
  }

  async getAllCoingeckoTokens() {
    return this.databaseService.getAllCoingeckoTokens();
  }
}
