import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '@/shared/database/database.service';
import { ICryptoCurrencyMapEntity, ICryptoCurrencyQuoteEntity } from '@/shared/web3/web3.interface';
import { PRICE_REQUEST_LIMIT } from '@/common/constants';

@Injectable()
export class TokenService {
  private logger = new Logger(TokenService.name);

  constructor(private databaseService: DatabaseService) {}

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

  getTokens() {
    return this.databaseService.getTokens(PRICE_REQUEST_LIMIT);
  }
}
