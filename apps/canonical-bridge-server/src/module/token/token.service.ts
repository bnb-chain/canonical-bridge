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
import { chains } from '@/common/constants/chains';
import { Web3Service } from '@/shared/web3/web3.service';

@Injectable()
export class TokenService {
  private logger = new Logger(TokenService.name);

  private cmcTokenStart = 1;
  private llamaTokenStart = 1;

  constructor(
    private web3Service: Web3Service,
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
    const platforms = this.getChainCmcPlatforms();

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
    const chainIds = this.getChainIds();
    const platforms = this.getChainLlamaPlatforms();

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

  async getTokenPrice(chainId: number, tokenAddress?: string) {
    const cmcPlatform = this.getChainConfigByChainId(chainId)?.extra?.cmcPlatform;
    const cmcToken = await this.databaseService.getToken(cmcPlatform, tokenAddress);

    const llamaPlatform = this.getChainConfigByChainId(chainId)?.extra?.llamaPlatform;
    const llamaToken = await this.databaseService.getCoingeckoToken(
      chainId,
      llamaPlatform,
      tokenAddress,
    );

    const reqArr: Promise<any>[] = [];
    if (cmcToken) {
      reqArr.push(this.web3Service.getCryptoCurrencyQuotes(cmcToken.id.toString()));
    } else {
      reqArr.push(Promise.reject());
    }

    if (llamaToken) {
      const { tokens } = await this.getLlamaTokenIds([llamaToken]);
      reqArr.push(this.web3Service.getLlamaTokenPrice(tokens));
    } else {
      reqArr.push(Promise.reject());
    }

    const [cmcRes, llamaRes] = await Promise.allSettled(reqArr);
    if (cmcRes.status === 'fulfilled' && cmcRes.value?.[0]?.quote.USD?.price !== undefined) {
      return cmcRes.value?.[0]?.quote.USD?.price;
    }
    if (llamaRes.status === 'fulfilled' && llamaRes.value.coins) {
      return Object.values<ICoinPrice>(llamaRes.value.coins ?? {})?.[0]?.price;
    }
  }

  public getFormattedAddress(chainId?: number, address?: string) {
    const chainInfo = chains.find((e) => e.id === chainId);
    if (chainInfo?.chainType !== 'evm') {
      return address;
    }
    return address?.toLowerCase();
  }

  public getChainConfigByCmcPlatform(platform: string) {
    return chains.find((e) => e.extra?.cmcPlatform === platform);
  }

  public getChainConfigByLlamaPlatform(platform: string) {
    return chains.find((e) => e.extra?.llamaPlatform === platform);
  }

  public getChainConfigByChainId(chainId: number) {
    return chains.find((e) => e.id === chainId);
  }

  public getChainCmcPlatforms() {
    return chains.filter((e) => e.extra?.cmcPlatform).map((e) => e.extra?.cmcPlatform);
  }

  public getChainLlamaPlatforms() {
    return chains.filter((e) => e.extra?.llamaPlatform).map((e) => e.extra?.llamaPlatform);
  }

  public getChainIds() {
    return chains.map((e) => e.id);
  }
}
