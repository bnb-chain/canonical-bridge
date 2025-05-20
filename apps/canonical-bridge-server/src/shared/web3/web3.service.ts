import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  IAssetPlatform,
  ICoin,
  ICoinPrice,
  ICryptoCurrencyMapEntity,
  ICryptoCurrencyMapPayload,
  ICryptoCurrencyQuoteEntity,
} from '@/shared/web3/web3.interface';
import {
  CBRIDGE_ENDPOINT,
  CMC_API_ENDPOINT,
  CMC_API_KEY,
  CMC_TOKEN_REQUEST_LIMIT,
  COINGECKO_ENDPOINT,
  DEBRIDGE_ENDPOINT,
  LLAMA_COINS_ENDPOINT,
  MAYAN_ENDPOINT,
  MESON_ENDPOINT,
  STARGATE_CHAIN_INFO,
  STARGATE_ENDPOINT,
} from '@/common/constants';
import { pick, values } from 'lodash';
import {
  ICBridgeTransferConfig,
  IDeBridgeChain,
  IDeBridgeToken,
  IMesonTransferConfig,
  IStargateTokenList,
  IMayanChain,
  IMayanTransferConfig,
  IMayanToken,
} from '@bnb-chain/canonical-bridge-sdk';

@Injectable()
export class Web3Service {
  private logger = new Logger(Web3Service.name);

  constructor(private httpService: HttpService) {}

  async getCryptoCurrencyMap(payload: Partial<ICryptoCurrencyMapPayload>) {
    const query = new URLSearchParams({
      limit: String(CMC_TOKEN_REQUEST_LIMIT),
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
    try {
      const { data } = await this.httpService.axiosRef.get<ICBridgeTransferConfig>(
        `${CBRIDGE_ENDPOINT}/v2/getTransferConfigsForAll`,
      );
      return data;
    } catch (e) {
      this.logger.log(`Failed to retrieve cBridge data at ${new Date().getTime()}, ${e.message}`);
    }
  }

  async getDebridgeChains() {
    try {
      const { data } = await this.httpService.axiosRef.get<{ chains: IDeBridgeChain[] }>(
        `${DEBRIDGE_ENDPOINT}/supported-chains-info`,
      );

      return data;
    } catch (e) {
      this.logger.log(
        `Failed to retrieve DeBridge chain data at ${new Date().getTime()},
        ${e.message}`,
      );
    }
  }

  async getDebridgeChainTokens(chainId: number) {
    try {
      const { data } = await this.httpService.axiosRef.get<{
        tokens: Record<string, IDeBridgeToken>;
      }>(`${DEBRIDGE_ENDPOINT}/token-list?chainId=${chainId}`);

      return data;
    } catch (e) {
      this.logger.log(
        `Failed to retrieve DeBridge token data from ${chainId} at ${new Date().getTime()},
        ${e.message}`,
      );
    }
  }

  async getStargateConfigs() {
    try {
      const { data } = await this.httpService.axiosRef.get<IStargateTokenList>(
        `${STARGATE_ENDPOINT}`,
      );
      const processedTokenList = [];
      const v2List = data.v2;
      v2List.forEach((token) => {
        const chainInfo = STARGATE_CHAIN_INFO.filter(
          (chain) => chain.chainName.toUpperCase() === token.chainKey.toUpperCase(),
        );
        if (chainInfo && chainInfo.length > 0) {
          processedTokenList.push({
            ...token,
            chainId: chainInfo[0].chainId,
            endpointID: chainInfo[0].endpointID,
          });
        }
      });
      return processedTokenList;
    } catch (e) {
      this.logger.log(
        `Failed to retrieve Stargate API data at ${new Date().getTime()}, ${e.message}`,
      );
    }
  }

  async getMesonConfigs() {
    try {
      const { data } = await this.httpService.axiosRef.get<{ result: IMesonTransferConfig }>(
        `${MESON_ENDPOINT}/limits`,
      );
      return data;
    } catch (e) {
      this.logger.log(`Failed to retrieve Meson API data at ${new Date().getTime()}, ${e}`);
      return [];
    }
  }

  async getMayanConfigs(): Promise<IMayanTransferConfig> {
    try {
      const { data: chains } = await this.httpService.axiosRef.get<Array<IMayanChain>>(
        `${MAYAN_ENDPOINT}/chains`,
      );
      const supportedChains = chains.filter(
        (chain) => chain.originActive && chain.destinationActive,
      );
      const { data: tokens } = await this.httpService.axiosRef.get<
        Record<string, Array<IMayanToken>>
      >(`${MAYAN_ENDPOINT}/tokens?nonPortal=true`);
      const supportedTokens = pick(
        tokens,
        supportedChains.map((c) => c.nameId),
      );
      return {
        chains: supportedChains,
        tokens: supportedTokens,
      };
    } catch (e) {
      this.logger.log(`Failed to retrieve cBridge data at ${new Date().getTime()}, ${e.message}`);
    }
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
