import { BaseAdapter } from '@/adapters/base';
import { ITransferTokenPair } from '@/adapters/base/types';
import { STARGATE_POOL } from '@/adapters/stargate/exports';
import {
  IStargateTransferConfig,
  IStargateChain,
  IStargateToken,
  IStargateAdapterOptions,
  ISendTokenInput,
  IStargateOFTQuote,
  IStargateQuoteOFT,
  IStarGateBusDriveSettings,
} from '@/adapters/stargate/types';
import { BridgeType } from '@/aggregator/types';
import { CLIENT_TIME_OUT } from '@/constants';
import axios, { AxiosInstance } from 'axios';
import { Hash, pad } from 'viem';

export class StargateAdapter extends BaseAdapter<
  IStargateTransferConfig,
  IStargateChain,
  IStargateToken
> {
  private client: AxiosInstance;
  public bridgeType: BridgeType = 'stargate';

  constructor(options: IStargateAdapterOptions) {
    const { timeout = CLIENT_TIME_OUT, endpoint, ...baseOptions } = options;

    super(baseOptions);

    this.client = axios.create({
      timeout,
      baseURL: endpoint,
    });
  }

  // https://mainnet.stargate-api.com/v1/swagger
  async getBusQueueTime({
    fromEndpointId,
    toEndpointId,
  }: {
    fromEndpointId: string;
    toEndpointId: string;
  }) {
    return (
      await this.client.get<IStarGateBusDriveSettings>(
        `${fromEndpointId}/${toEndpointId}`
      )
    ).data;
  }

  // https://stargateprotocol.gitbook.io/stargate/v/v2-developer-docs/integrate-with-stargate/estimating-fees#quoteoft
  async getQuoteOFT({
    publicClient,
    bridgeAddress,
    endPointId,
    receiver,
    amount,
  }: IStargateQuoteOFT) {
    const sendParams = {
      dstEid: endPointId,
      to: pad(receiver, { size: 32 }) as `0x${string}`,
      amountLD: amount,
      minAmountLD: amount,
      extraOptions: '0x' as `0x${string}`,
      composeMsg: '0x' as `0x${string}`,
      oftCmd: '0x01' as `0x${string}`, // '0x01' for bus, '' for taxi
    };

    try {
      const quoteOFTResponse = await publicClient?.readContract({
        address: bridgeAddress,
        abi: STARGATE_POOL,
        functionName: 'quoteOFT',
        args: [sendParams] as any,
      });
      return quoteOFTResponse;
    } catch (error: any) {
      throw new Error(`Failed to get quote OFT: ${error}`);
    }
  }

  // https://stargateprotocol.gitbook.io/stargate/v/v2-developer-docs/integrate-with-stargate/estimating-fees#quotesend
  async getQuoteSend({
    publicClient,
    bridgeAddress,
    endPointId,
    receiver,
    amount,
    minAmount,
  }: IStargateOFTQuote) {
    const sendParams = {
      dstEid: endPointId,
      to: pad(receiver, { size: 32 }) as `0x${string}`,
      amountLD: amount,
      minAmountLD: minAmount,
      extraOptions: '0x' as `0x${string}`,
      composeMsg: '0x' as `0x${string}`,
      oftCmd: '0x01' as `0x${string}`, // '0x01' for bus, '' for taxi
    };
    try {
      const quoteSendResponse = await publicClient?.readContract({
        address: bridgeAddress,
        abi: STARGATE_POOL,
        functionName: 'quoteSend',
        args: [sendParams, false] as any, // false for not paying lzToken
      });
      return quoteSendResponse;
    } catch (error: any) {
      throw new Error(`Failed to get quote send: ${error}`);
    }
  }

  /**
   * Send token through Stargate bridge
   * @param {WalletClient} walletClient Wallet client
   * @param {PublicClient} publicClient Public client
   * @param {Address} bridgeAddress Bridge address
   * @param {Address} tokenAddress ERC-20 token address
   * @param {Number} endPointId Stargate end point ID
   * @param {Address} receiver Receiver address
   * @param {BigInt} amount Send amount
   * @returns {Hash} transaction hash
   */
  async sendToken({
    walletClient,
    publicClient,
    bridgeAddress,
    tokenAddress,
    endPointId,
    receiver,
    amount,
  }: ISendTokenInput): Promise<Hash> {
    const sendParams = {
      dstEid: endPointId,
      to: pad(receiver, { size: 32 }) as `0x${string}`,
      amountLD: amount,
      minAmountLD: amount,
      extraOptions: '0x' as `0x${string}`,
      composeMsg: '0x' as `0x${string}`,
      oftCmd: '0x01' as `0x${string}`, // '0x01' for bus, '' for taxi
    };
    try {
      const quoteOFTResponse = await this.getQuoteOFT({
        publicClient,
        bridgeAddress,
        endPointId,
        receiver,
        amount,
      });
      if (quoteOFTResponse?.[2].amountReceivedLD) {
        sendParams.minAmountLD = BigInt(quoteOFTResponse[2].amountReceivedLD);
      }
      const quoteSendResponse = await this.getQuoteSend({
        publicClient,
        bridgeAddress,
        endPointId,
        receiver,
        amount,
        minAmount: sendParams.minAmountLD,
      });
      let nativeFee = quoteSendResponse.nativeFee;
      if (tokenAddress === '0x0000000000000000000000000000000000000000') {
        nativeFee += sendParams.amountLD;
      }
      const sendTokenArgs = {
        address: bridgeAddress,
        abi: STARGATE_POOL,
        functionName: 'sendToken',
        args: [sendParams, quoteSendResponse, receiver],
        value: nativeFee,
        account: receiver,
      };
      const hash = await walletClient?.writeContract({
        ...(sendTokenArgs as any),
      });
      return hash;
    } catch (error: any) {
      throw new Error(`Failed to send token: ${error}`);
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

    const chainMap = new Map<number, IStargateChain>();
    filteredChains.forEach((chain) => {
      chainMap.set(chain.chainId, chain);
    });

    this.chains = filteredChains;
    this.chainMap = chainMap;
  }

  protected initTokens() {
    const { tokens } = this.config;

    const tokenMap = new Map<number, IStargateToken[]>();
    const symbolMap = new Map<number, Map<string, IStargateToken>>();
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
        symbolMap.set(chainId, new Map<string, IStargateToken>());

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
      Map<number, Map<string, ITransferTokenPair<IStargateToken>>>
    >();

    this.chains.forEach((fromChain) => {
      this.chains.forEach((toChain) => {
        if (
          fromChain.chainId !== toChain.chainId &&
          fromChain.network === toChain.network
        ) {
          const fromTokens = this.tokenMap.get(fromChain.chainId) ?? [];

          const transferableTokenMap = new Map<
            string,
            ITransferTokenPair<IStargateToken>
          >();
          fromTokens.forEach((fromToken) => {
            const toToken = this.getToToken({
              fromChainId: fromChain.chainId,
              toChainId: toChain.chainId,
              fromTokenSymbol: fromToken.symbol?.toUpperCase(),
            });

            if (toToken) {
              const tokenPair: ITransferTokenPair<IStargateToken> = {
                fromChainId: fromChain.chainId,
                toChainId: toChain.chainId,
                fromToken,
                toToken,
                fromTokenAddress: fromToken.address,
                toTokenAddress: toToken.address,
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
                  Map<string, ITransferTokenPair<IStargateToken>>
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

  public getChainId(chain: IStargateChain) {
    return chain.chainId;
  }

  public getTokenInfo({
    chainId,
    token,
  }: {
    chainId: number;
    token: IStargateToken;
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
}
