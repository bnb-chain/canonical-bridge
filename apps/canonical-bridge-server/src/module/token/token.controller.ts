import { Controller, Get, Inject, Logger, Query } from '@nestjs/common';
import { CACHE_KEY } from '@/common/constants';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { TokenService } from '@/module/token/token.service';

@Controller('token')
export class TokenController {
  private logger = new Logger(TokenController.name);

  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private tokenService: TokenService,
  ) {}

  @Get('/cmc')
  getCmcConfig() {
    return this.cache.get(CACHE_KEY.CMC_CONFIG);
  }

  @Get('/llama')
  getLlamaConfig() {
    return this.cache.get(CACHE_KEY.LLAMA_CONFIG);
  }

  @Get('/v2/price')
  getTokenPrice(@Query('chainId') _chainId: string, @Query('tokenAddress') tokenAddress?: string) {
    const chainId = Number(_chainId);
    return this.tokenService.getTokenPrice(chainId, tokenAddress);
  }

  @Get('/v2/cmc')
  getCmcConfigV2() {
    return this.cache.get(CACHE_KEY.CMC_CONFIG_V2);
  }

  @Get('/v2/llama')
  getLlamaConfigV2() {
    return this.cache.get(CACHE_KEY.LLAMA_CONFIG_V2);
  }
}
