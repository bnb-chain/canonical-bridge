import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  ICryptoCurrencyMapEntity,
  ICryptoCurrencyMapPayload,
  ICryptoCurrencyQuoteEntity,
} from '@/shared/web3/web3.interface';
import { CMC_API_ENDPOINT, CMC_API_KEY, TOKEN_REQUEST_LIMIT } from '@/common/constants';
import { values } from 'lodash';

@Injectable()
export class Web3Service {
  private logger = new Logger(Web3Service.name);

  constructor(private httpService: HttpService) {}

  async getCryptoCurrencyMap(payload: Partial<ICryptoCurrencyMapPayload>) {
    const query = new URLSearchParams({
      limit: String(TOKEN_REQUEST_LIMIT),
      start: String(payload.start),
    }).toString();

    const { data } = await this.httpService.axiosRef.get<ICryptoCurrencyMapEntity[]>(
      `${CMC_API_ENDPOINT}/v1/cryptocurrency/map?${query}`,
      {
        headers: { 'X-CMC_PRO_API_KEY': CMC_API_KEY },
      },
    );

    return data || [];
  }

  async getCryptoCurrencyQuotes(ids: string) {
    const { data } = await this.httpService.axiosRef.get<
      Record<string, ICryptoCurrencyQuoteEntity>
    >(`${CMC_API_ENDPOINT}/v2/cryptocurrency/quotes/latest?id=${ids}`, {
      headers: { 'X-CMC_PRO_API_KEY': CMC_API_KEY },
    });

    return values(data || {});
  }
}
