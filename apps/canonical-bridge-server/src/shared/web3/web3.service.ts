import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  IAssetPlatform,
  ICoin,
  ICoinPrice,
  ICryptoCurrencyMapEntity,
  ICryptoCurrencyMapPayload,
  ICryptoCurrencyQuoteEntity,
  IDebridgeChain,
  IDebridgeToken,
  IMesonChain,
  IStargateTokenList,
  ITransferConfigsForAll,
} from '@/shared/web3/web3.interface';
import {
  CBRIDGE_ENDPOINT,
  CMC_API_ENDPOINT,
  CMC_API_KEY,
  COINGECKO_ENDPOINT,
  DEBRIDGE_ENDPOINT,
  STARGATE_ENDPOINT,
  MESON_ENDPOINT,
  LLAMA_COINS_ENDPOINT,
  TOKEN_REQUEST_LIMIT,
  STARGATE_CHAIN_INFO,
} from '@/common/constants';
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

  async getTransferConfigsForAll() {
    const { data } = await this.httpService.axiosRef.get<ITransferConfigsForAll>(
      `${CBRIDGE_ENDPOINT}/v2/getTransferConfigsForAll`,
    );

    return data;
  }

  async getDebridgeChains() {
    const { data } = await this.httpService.axiosRef.get<{ chains: IDebridgeChain[] }>(
      `${DEBRIDGE_ENDPOINT}/supported-chains-info`,
    );

    return data;
  }

  async getDebridgeChainTokens(chainId: number) {
    const { data } = await this.httpService.axiosRef.get<{
      tokens: Record<string, IDebridgeToken>;
    }>(`${DEBRIDGE_ENDPOINT}/token-list?chainId=${chainId}`);

    return data;
  }

  async getStargateConfigs() {
    const { data } = await this.httpService.axiosRef.get<IStargateTokenList>(
      `${STARGATE_ENDPOINT}`,
    );
    const processedTokenList = [];
    try {
      const v2List = data.v2;
      v2List.forEach((token) => {
        const chainInfo = STARGATE_CHAIN_INFO.filter(
          (chain) => chain.chainName.toUpperCase() === token.chainKey.toUpperCase(),
        );
        if (chainInfo && chainInfo.length > 0) {
          processedTokenList.push({ ...token, endpointID: chainInfo[0].endpointID });
        }
      });
    } catch (e) {
      console.log('stargate api failed', e, new Date());
    }
    return processedTokenList;
  }

  async getMesonConfigs() {
    const { data } = await this.httpService.axiosRef.get<{ result: IMesonChain[] }>(
      `${MESON_ENDPOINT}/limits`,
    );
    return data;
  }

  async getAssetPlatforms() {
    const { data } = await this.httpService.axiosRef.get<IAssetPlatform[]>(
      `${COINGECKO_ENDPOINT}/v3/asset_platforms`,
    );
    return data;
  }

  async getCoinList() {
    const { data } = await this.httpService.axiosRef.get<ICoin[]>(
      `${COINGECKO_ENDPOINT}/v3/coins/list?include_platform=true`,
    );
    return data;
  }

  async getLlamaTokenPrice(ids: string) {
    const { data } = await this.httpService.axiosRef.get<{ coins: Record<string, ICoinPrice> }>(
      `${LLAMA_COINS_ENDPOINT}/prices/current/${ids}`,
    );
    return data;
  }
}
