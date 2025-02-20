import { Inject, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '@/shared/database/database.service';
import {
  IAssetPlatform,
  ICoin,
  ICoinPrice,
  ICryptoCurrencyMapEntity,
  ICryptoCurrencyQuoteEntity,
} from '@/shared/web3/web3.interface';
import { CACHE_KEY, CMC_PRICE_REQUEST_LIMIT, LLAMA_PRICE_REQUEST_LIMIT } from '@/common/constants';
import { get, isEmpty } from 'lodash';
import { Prisma } from '@prisma/client';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Web3Service } from '@/shared/web3/web3.service';
import { UtilService } from '@/shared/util/util.service';

@Injectable()
export class TokenService {
  private logger = new Logger(TokenService.name);

  private cmcTokenStart = 1;
  private llamaTokenStart = 1;

  constructor(
    private web3Service: Web3Service,
    private databaseService: DatabaseService,
    private utilService: UtilService,
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
    const payload = tokens
      .filter((token) => {
        return token.is_active === 1;
      })
      .map((token) => ({
        id: token.id,
        price: token.quote.USD?.price,
      }));

    return this.databaseService.updateTokens(payload);
  }

  async syncLlamaTokenPrice(tokens: Record<string, ICoinPrice>, keyMap: Record<string, string>) {
    const _tokens: ICoinPrice[] = [];

    Object.entries(keyMap).forEach(([key, v]) => {
      const data = tokens[key];
      if (data?.price) {
        _tokens.push({ id: v, price: data?.price, decimals: data?.decimals });
      }
    });

    return this.databaseService.updateLlamaTokens(_tokens);
  }

  async getCmcTokenIdsForPriceJob() {
    const platforms = this.utilService.getChainCmcPlatforms();

    const tokens = await this.databaseService.getTokens(
      this.cmcTokenStart,
      CMC_PRICE_REQUEST_LIMIT,
      platforms,
    );

    if (tokens.length < CMC_PRICE_REQUEST_LIMIT) {
      this.cmcTokenStart = 1;
    } else {
      this.cmcTokenStart++;
    }
    return tokens.map((token) => token.id).join(',');
  }

  async getLlamaTokenIds(tokens: Prisma.LlamaTokenCreateInput[]) {
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

  async getLlamaTokenIdsForPriceJob() {
    const chainIds = this.utilService.getChainIds();
    const platforms = this.utilService.getChainLlamaPlatforms();

    const tokens = await this.databaseService.getCoingeckoTokens(
      this.llamaTokenStart,
      LLAMA_PRICE_REQUEST_LIMIT,
      chainIds,
      platforms,
    );

    if (tokens.length < LLAMA_PRICE_REQUEST_LIMIT) {
      this.llamaTokenStart = 1;
    } else {
      this.llamaTokenStart++;
    }

    return this.getLlamaTokenIds(tokens);
  }

  async getAllTokens() {
    return this.databaseService.getAllTokens();
  }

  async getAllCoingeckoTokens() {
    return this.databaseService.getAllCoingeckoTokens();
  }

  async getTokenPrice(chainId: number, tokenAddress?: string, tokenSymbol?: string) {
    const cmcPlatform = this.utilService.getChainConfigByChainId(chainId)?.extra?.cmcPlatform;
    const cmcToken = await this.databaseService.getToken(cmcPlatform, tokenAddress);

    const llamaPlatform = this.utilService.getChainConfigByChainId(chainId)?.extra?.llamaPlatform;
    const llamaToken = await this.databaseService.getCoingeckoToken(
      chainId,
      llamaPlatform,
      tokenAddress,
    );

    const reqArr: Promise<any>[] = [];
    if (cmcToken) {
      reqArr.push(this.web3Service.getCryptoCurrencyQuotes(cmcToken.id.toString()));
    } else {
      reqArr.push(Promise.resolve());
    }

    if (llamaToken) {
      const { tokens } = await this.getLlamaTokenIds([llamaToken]);
      reqArr.push(this.web3Service.getLlamaTokenPrice(tokens));
    } else {
      reqArr.push(Promise.resolve());
    }

    const [cmcRes, llamaRes] = await Promise.allSettled(reqArr);
    if (cmcRes.status === 'fulfilled') {
      const price = cmcRes.value?.[0]?.quote?.USD?.price;
      if (price !== undefined) {
        return Number(price);
      }
    }
    if (llamaRes.status === 'fulfilled' && llamaRes.value?.coins) {
      const price = Object.values<ICoinPrice>(llamaRes.value.coins ?? {})?.[0]?.price;
      if (price !== undefined) {
        return Number(price);
      }
    }

    const cmcPrices = await this.cache.get(`${CACHE_KEY.CMC_CONFIG_V2}`);
    const llamaPrices = await this.cache.get(`${CACHE_KEY.LLAMA_CONFIG_V2}`);
    const key = `1:${tokenSymbol?.toLowerCase()}`;

    const price = cmcPrices?.[key]?.price ?? llamaPrices?.[key]?.price;
    return price;
  }
}
