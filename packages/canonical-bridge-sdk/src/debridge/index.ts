import { CLIENT_TIME_OUT } from '@/core/constants';
import { BaseBridgeConfigOptions, BaseBridgeConfig } from '@/core/types';
import {
  DeBridgeCreateQuoteResponse,
  IDeBridgeEstimatedFeesInput,
  ISendDebridgeTokenInput,
} from '@/debridge/types';
import axios, { AxiosInstance } from 'axios';
import { Hash } from 'viem';

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
    affiliateFeePercent = 0,
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
        dstChainTokenOutRecipient: userAddress,
        dstChainOrderAuthorityAddress: userAddress,
        srcChainOrderAuthorityAddress: userAddress,
      } as any;
      const urlParams = new URLSearchParams(deBridgeParams as any);
      const deBridgeQuote = await this.createTxQuote(urlParams);
      return deBridgeQuote;
    } catch (error: any) {
      throw new Error(`Failed to get DeBridge Estimated Fees: ${error}`);
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
}
