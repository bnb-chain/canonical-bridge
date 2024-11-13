import { BaseAdapter } from '@/adapters/base';
import { ITransferTokenPair } from '@/adapters/base/types';
import {
  IDeBridgeTransferConfig,
  IDeBridgeChain,
  IDeBridgeToken,
  IDeBridgeAdapterOptions,
  ISendDebridgeTokenInput,
  IDeBridgeEstimatedFeesInput,
  IDeBridgeCreateQuoteResponse,
} from '@/adapters/deBridge/types';
import { isSameAddress } from '@/shared/address';
import { BridgeType } from '@/aggregator/types';
import axios, { AxiosInstance } from 'axios';
import { CLIENT_TIME_OUT, env } from '@/constants';
import { Hash } from 'viem';

export class DeBridgeAdapter extends BaseAdapter<
  IDeBridgeTransferConfig,
  IDeBridgeChain,
  IDeBridgeToken
> {
  private client: AxiosInstance;
  private statsClient: AxiosInstance;
  public bridgeType: BridgeType = 'deBridge';

  constructor(options: IDeBridgeAdapterOptions) {
    const {
      timeout = CLIENT_TIME_OUT,
      endpoint = env.DEBRIDGE_ENDPOINT,
      statsEndpoint = env.DEBRIDGE_STATS_ENDPOINT,
      ...baseOptions
    } = options;

    super(baseOptions);

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
      await this.client.get<IDeBridgeCreateQuoteResponse>(
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
  }: IDeBridgeEstimatedFeesInput): Promise<IDeBridgeCreateQuoteResponse> {
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
    return (await this.client.get(`/dln/order/${id}`)).data;
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

  protected initChains() {
    const { chains, tokens } = this.config;

    const filteredChains = chains.filter((chain) => {
      const hasChainConfig = this.includedChains.includes(chain.chainId);
      const isExcludedChain = this.excludedChains.includes(chain.chainId);
      const hasToken = tokens[chain.chainId]?.length > 0;
      return hasChainConfig && !isExcludedChain && hasToken;
    });

    const chainMap = new Map<number, IDeBridgeChain>();
    filteredChains.forEach((chain) => {
      chainMap.set(chain.chainId, chain);
    });

    this.chains = filteredChains;
    this.chainMap = chainMap;
  }

  protected initTokens() {
    const { tokens } = this.config;

    const tokenMap = new Map<number, IDeBridgeToken[]>();
    const symbolMap = new Map<number, Map<string, IDeBridgeToken>>();
    Object.entries(tokens).forEach(([id, chainTokens]) => {
      const chainId = Number(id);

      const filteredTokens = chainTokens.filter((token) => {
        const isExcludedToken = this.checkIsExcludedToken({
          excludedList: this.excludedTokens?.[chainId],
          tokenSymbol: token.symbol?.toUpperCase(),
          tokenAddress: token.address,
        });
        return !isExcludedToken;
      });

      if (filteredTokens.length > 0 && this.chainMap.has(chainId)) {
        symbolMap.set(chainId, new Map<string, IDeBridgeToken>());

        filteredTokens.forEach((token) => {
          symbolMap.get(chainId)?.set(token.symbol?.toUpperCase(), token);
        });

        tokenMap.set(chainId, filteredTokens);
      }
    });

    this.tokenMap = tokenMap;
    this.symbolMap = symbolMap;
  }

  protected initTransferMap() {
    const transferMap = new Map<
      number,
      Map<number, Map<string, ITransferTokenPair<IDeBridgeToken>>>
    >();

    this.chains.forEach((fromChain) => {
      this.chains.forEach((toChain) => {
        if (fromChain.chainId !== toChain.chainId) {
          const fromTokens = this.tokenMap.get(fromChain.chainId) ?? [];

          const transferableTokenMap = new Map<
            string,
            ITransferTokenPair<IDeBridgeToken>
          >();
          fromTokens.forEach((fromToken) => {
            const toToken = this.getToToken({
              fromChainId: fromChain.chainId,
              toChainId: toChain.chainId,
              fromTokenSymbol: fromToken.symbol?.toUpperCase(),
            });

            if (toToken) {
              const tokenPair: ITransferTokenPair<IDeBridgeToken> = {
                fromChainId: fromChain.chainId,
                toChainId: toChain.chainId,
                fromTokenAddress: fromToken.address,
                toTokenAddress: toToken.address,
                fromToken,
                toToken,
              };
              transferableTokenMap.set(
                fromToken.symbol?.toUpperCase(),
                tokenPair
              );
            }
          });

          if (transferableTokenMap.size > 0) {
            if (!transferMap.has(fromChain.chainId)) {
              transferMap.set(
                fromChain.chainId,
                new Map<
                  number,
                  Map<string, ITransferTokenPair<IDeBridgeToken>>
                >()
              );
            }
            transferMap
              .get(fromChain.chainId)
              ?.set(toChain.chainId, transferableTokenMap);
          }
        }
      });
    });

    this.transferMap = transferMap;
  }

  public getChainId(chain: IDeBridgeChain) {
    return chain.chainId;
  }

  public getTokenInfo({
    chainId,
    token,
  }: {
    chainId: number;
    token: IDeBridgeToken;
  }) {
    return {
      name: token.name,
      symbol: token.symbol,
      address: token.address,
      decimals: token.decimals,
      ...this.getTokenDisplaySymbolAndIcon({
        chainId,
        tokenAddress: token.address,
        defaultSymbol: token.symbol,
      }),
    };
  }

  public getTokenByAddress({
    chainId,
    address,
  }: {
    chainId: number;
    address: string;
  }) {
    if (chainId && address) {
      const tokens = this.tokenMap.get(Number(chainId));
      const target = tokens?.find((item) =>
        isSameAddress(item.address, address)
      );
      return target;
    }
  }
}
