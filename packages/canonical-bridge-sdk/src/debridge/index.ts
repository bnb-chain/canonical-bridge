import { createAdapter } from '@/debridge/utils/createAdapter';
import { CLIENT_TIME_OUT, VALIDATION_API_TIMEOUT } from '@/core/constants';
import {
  BaseBridgeConfigOptions,
  BaseBridgeConfig,
  CreateAdapterParameters,
} from '@/core/types';
import {
  DeBridgeCreateQuoteResponse,
  DeBridgeTransferConfigs,
  IDeBridgeEstimatedFeesInput,
  IDeBridgeToken,
  IDeBridgeTokenValidateParams,
  ISendDebridgeTokenInput,
} from '@/debridge/types';
import axios, { AxiosInstance } from 'axios';
import { Hash } from 'viem';
import { isValidTokenAddress } from '@/core/utils/address';

export * from './types';

export interface DeBridgeConfigOptions extends BaseBridgeConfigOptions {
  statsEndpoint: string;
}

export interface DeBridgeConfig extends BaseBridgeConfig {
  statsEndpoint: string;
}

export function deBridgeConfig(options: DeBridgeConfigOptions): DeBridgeConfig {
  return {
    bridgeType: 'deBridge',
    timeout: CLIENT_TIME_OUT,
    ...options,
  };
}

export class DeBridge {
  private client?: AxiosInstance;
  private statsClient?: AxiosInstance;

  constructor(config: DeBridgeConfigOptions) {
    const { timeout, endpoint, statsEndpoint } = config;

    this.client = axios.create({
      timeout,
      baseURL: endpoint,
    });

    this.statsClient = axios.create({
      timeout,
      baseURL: statsEndpoint,
    });
  }

  // https://deswap.debridge.finance/v1.0/#/DLN/DlnOrderControllerV10_createOrder
  async createTxQuote(urlParams: any) {
    return (
      await this.client!.get<DeBridgeCreateQuoteResponse>(
        `/dln/order/create-tx?${urlParams.toString()}`
      )
    ).data;
  }

  /**
   * Get estimated fees from transaction quote API
   * @param {number} fromChainId - Chain ID of the source chain
   * @param {Address} fromTokenAddress - Address of ERC20 token on the source chain
   * @param {BigInt} amount - Send amount
   * @param {number} toChainId - Chain ID of the destination chain
   * @param {Address} toTokenAddress - Address of ERC20 token on the destination chain
   * @param {Address} userAddress - user/account address
   */
  async getEstimatedFees({
    fromChainId,
    fromTokenAddress,
    amount,
    toChainId,
    toTokenAddress,
    userAddress,
    toUserAddress,
    affiliateFeePercent = 0,
    accesstoken = '',
    prependOperatingExpenses = false,
  }: IDeBridgeEstimatedFeesInput): Promise<DeBridgeCreateQuoteResponse> {
    try {
      const deBridgeParams = {
        srcChainId: fromChainId,
        srcChainTokenIn: fromTokenAddress,
        srcChainTokenInAmount: amount,
        dstChainId: toChainId,
        dstChainTokenOut: toTokenAddress,
        prependOperatingExpenses,
        affiliateFeePercent,
        dstChainTokenOutRecipient: toUserAddress || userAddress,
        dstChainOrderAuthorityAddress: toUserAddress || userAddress,
        srcChainOrderAuthorityAddress: userAddress,
      } as any;

      if (accesstoken) {
        deBridgeParams.accesstoken = accesstoken;
      }
      const urlParams = new URLSearchParams(deBridgeParams as any);
      const deBridgeQuote = await this.createTxQuote(urlParams);
      return deBridgeQuote;
    } catch (error: any) {
      if (error.response?.data?.errorMessage) {
        throw new Error(error.response.data.errorId);
      } else {
        throw new Error(`${error.message || error}`);
      }
    }
  }

  // https://deswap.debridge.finance/v1.0/#/DLN/DlnOrderControllerV10_getOrder
  async getOrder({ id }: { id: string }) {
    return (await this.client!.get(`/dln/order/${id}`)).data;
  }

  // https://stats-api.dln.trade/swagger/index.html
  /**
   * Get list of orders by filters
   * @param address Account address
   * @param pageId Page number
   * @param pageSize Records per page
   * @param fromChainIds Source chain IDs
   * @param toChainIds Destination chain IDs
   */
  async getStatsHistory({
    address,
    pageId = 0,
    pageSize = 20,
    fromChainIds = [],
    toChainIds = [],
  }: {
    address: string;
    pageId: number;
    pageSize: number;
    fromChainIds: number[];
    toChainIds: number[];
  }) {
    return (
      await this.statsClient!.post('/Orders/filteredList', {
        filter: address,
        skip: pageId, // page number
        take: pageSize, // data per page
        giveChainIds: fromChainIds,
        takeChainIds: toChainIds,
      })
    ).data;
  }

  /**
   * Send token via DeBridge
   * @param {WalletClient} walletClient Wallet client
   * @param {Address} bridgeAddress Bridge address
   * @param {String} data Transaction data
   * @param {BigInt} amount Send amount
   * @param {Address} address wallet/account address
   * @returns {Hash} transaction hash
   */
  async sendToken({
    walletClient,
    bridgeAddress,
    data,
    amount,
    address,
  }: ISendDebridgeTokenInput): Promise<Hash> {
    try {
      const hash = await walletClient.sendTransaction({
        to: bridgeAddress as `0x${string}`,
        data: data,
        value: amount,
        account: address,
        chain: walletClient.chain,
      });
      return hash;
    } catch (error) {
      throw new Error(`Failed to send DeBridge token: ${error}`);
    }
  }

  validateDeBridgeToken = async ({
    fromChainId,
    fromChainType,
    toChainId,
    toChainType,
    fromTokenAddress,
    fromTokenSymbol,
    fromTokenDecimals,
    fromBridgeAddress,
    toTokenAddress,
    toTokenSymbol,
    toTokenDecimals,
    amount,
    deBridgeEndpoint,
  }: IDeBridgeTokenValidateParams) => {
    try {
      if (
        !fromChainId ||
        !fromChainType ||
        !fromTokenAddress ||
        !toTokenAddress ||
        !fromTokenSymbol ||
        !toTokenSymbol ||
        !toChainId ||
        !toChainType ||
        !amount ||
        !fromTokenDecimals ||
        (!fromBridgeAddress && fromChainType === 'evm') ||
        !toTokenDecimals ||
        !deBridgeEndpoint
      ) {
        console.log('Invalid deBridge token validation params');
        console.log('-- fromChainId', fromChainId);
        console.log('-- fromChainType', fromChainType);
        console.log('-- fromTokenSymbol', fromTokenSymbol);
        console.log('-- fromTokenAddress', fromTokenAddress);
        console.log('-- fromTokenDecimals', fromTokenDecimals);
        console.log('-- fromBridgeAddress', fromBridgeAddress);
        console.log('-- toChainId', toChainId);
        console.log('-- toChainType', toChainType);
        console.log('-- toTokenSymbol', toTokenSymbol);
        console.log('-- toTokenAddress', toTokenAddress);
        console.log('-- toTokenDecimals', toTokenDecimals);
        console.log('-- amount', amount);
        console.log('-- deBridgeEndpoint', deBridgeEndpoint);
        return false;
      }
      // Check amount
      if (Number(amount) <= 0) {
        console.log('Invalid deBridge amount', amount);
        return false;
      }
      // Check from token address
      const isValidFromToken = isValidTokenAddress({
        contractAddress: fromTokenAddress,
        chainType: fromChainType,
        isSourceChain: true,
      });
      // Check to token address
      const isValidToToken = isValidTokenAddress({
        contractAddress: toTokenAddress,
        chainType: toChainType,
        isSourceChain: true,
      });
      if (!isValidFromToken || !isValidToToken) {
        console.log(
          'Invalid deBridge bridge token address',
          fromTokenAddress,
          toTokenAddress
        );
        return false;
      }
      // Check bridge contract address
      if (fromChainType !== 'solana') {
        const isValidBridgeContractAddress = isValidTokenAddress({
          contractAddress: fromBridgeAddress,
          chainType: fromChainType,
          isSourceChain: true,
        });
        if (!isValidBridgeContractAddress) {
          console.log(
            'Invalid deBridge bridge contract address',
            fromBridgeAddress
          );
          return false;
        }
      }
      // Check token info on API
      const fromRequest = axios.get<{
        tokens: { [key: string]: IDeBridgeToken };
      }>(`${deBridgeEndpoint}/token-list?chainId=${fromChainId}`, {
        timeout: VALIDATION_API_TIMEOUT,
      });
      const toRequest = axios.get<{
        tokens: { [key: string]: IDeBridgeToken };
      }>(`${deBridgeEndpoint}/token-list?chainId=${toChainId}`, {
        timeout: VALIDATION_API_TIMEOUT,
      });
      const [fromTokenList, toTokenList] = await Promise.allSettled([
        fromRequest,
        toRequest,
      ]);
      if (
        fromTokenList.status === 'fulfilled' &&
        toTokenList.status === 'fulfilled'
      ) {
        const fromToken =
          fromTokenList?.value?.data.tokens[fromTokenAddress.toLowerCase()];
        const toToken =
          toTokenList?.value?.data.tokens[toTokenAddress.toLowerCase()];
        if (
          !!fromToken &&
          fromToken?.address.toLowerCase() === fromTokenAddress.toLowerCase() &&
          fromToken?.symbol === fromTokenSymbol &&
          fromToken?.decimals === fromTokenDecimals &&
          !!toToken &&
          toToken?.address.toLowerCase() === toTokenAddress.toLowerCase() &&
          toToken?.symbol === toTokenSymbol &&
          toToken?.decimals === toTokenDecimals
        ) {
          console.log('deBridge token info matched', fromToken);
          return true;
        }
      } else {
        console.log(
          'Failed to get deBridge API token info',
          fromTokenList,
          toTokenList
        );
        return false;
      }
      console.log('Could not find deBridge token info');
      console.log('-- fromChainId', fromChainId);
      console.log('-- from fromChainType', fromChainType);
      console.log('-- from tokenSymbol', fromTokenSymbol);
      console.log('-- from tokenAddress', fromTokenAddress);
      console.log('-- from TokenDecimals', fromTokenDecimals);
      console.log('-- to ChainId', toChainId);
      console.log('-- to ChainType', toChainType);
      console.log('-- to tokenSymbol', toTokenSymbol);
      console.log('-- to tokenAddress', toTokenAddress);
      console.log('-- to TokenDecimals', toTokenDecimals);
      console.log('-- amount', amount);
      return false;
      // eslint-disable-next-line
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log('deBridge token validation error', error);
      return false;
    }
  };

  /** @see createAdapter for implementation details */
  createAdapter(params: CreateAdapterParameters<DeBridgeTransferConfigs>) {
    return createAdapter(params);
  }
}
