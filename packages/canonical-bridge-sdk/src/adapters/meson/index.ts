import { BaseAdapter } from '@/adapters/base';
import { ITransferTokenPair } from '@/adapters/base/types';
import {
  IGetMesonEstimateFeeInput,
  IMesonAdapterOptions,
  IMesonChain,
  IMesonEncodeSwapInput,
  IMesonSendTokenInput,
  IMesonToken,
} from '@/adapters/meson/types';
import { isNativeToken } from '@/shared/address';
import { BridgeType } from '@/aggregator/types';
import axios, { AxiosInstance } from 'axios';
import { CLIENT_TIME_OUT, env } from '@/constants';

export class MesonAdapter extends BaseAdapter<
  IMesonChain[],
  IMesonChain,
  IMesonToken
> {
  protected options: IMesonAdapterOptions;
  private client: AxiosInstance;
  public bridgeType: BridgeType = 'meson';

  constructor(options: IMesonAdapterOptions) {
    const finalOptions = {
      timeout: CLIENT_TIME_OUT,
      endpoint: env.MESON_ENDPOINT,
      ...options,
    };

    super(finalOptions);
    this.options = finalOptions;

    this.client = axios.create({
      timeout: this.options.timeout,
      baseURL: this.options.endpoint,
    });
  }

  async getEstimatedFees({
    fromToken,
    toToken,
    amount,
    fromAddr,
  }: IGetMesonEstimateFeeInput) {
    try {
      const { data: priceResponse } = await this.client.post('/price', {
        from: fromToken,
        to: toToken,
        amount: amount,
        fromAddress: fromAddr,
        fromContract: false,
      });
      return priceResponse;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      if (error?.response.data) {
        console.log('Meson fee error', error?.response.data);
        return error?.response?.data;
      } else {
        throw new Error(`Failed to get Meson fees ${error}`);
      }
    }
  }

  async sendToken({
    fromAddress,
    recipient,
    signature,
    encodedData,
  }: IMesonSendTokenInput) {
    try {
      const { data: swapResponse } = await this.client.post(
        `/swap/${encodedData}`,
        {
          fromAddress: fromAddress,
          recipient: recipient,
          signature: signature,
        }
      );
      return swapResponse;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      if (error?.response.data) {
        console.log('Meson send token error', error?.response.data);
        return error?.response?.data;
      } else {
        throw new Error(`Failed to send transaction ${error}`);
      }
    }
  }

  async getUnsignedMessage({
    fromToken,
    toToken,
    amount,
    fromAddress,
    recipient,
  }: IMesonEncodeSwapInput) {
    try {
      const { data: swapResponse } = await this.client.post('/swap', {
        from: fromToken,
        to: toToken,
        amount: amount,
        fromAddress: fromAddress,
        recipient: recipient,
        dataToContract: '',
      });
      return swapResponse;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      if (error?.response.data) {
        console.log('Meson get unsigned message error', error?.response.data);
        return error?.response?.data;
      } else {
        throw new Error(`Failed to get unsigned message ${error}`);
      }
    }
  }

  protected initChains() {
    const chains = this.config;

    const filteredChains = chains.filter((chain) => {
      const hasChainConfig = this.includedChains.includes(
        Number(chain.chainId)
      );
      const isExcludedChain = this.excludedChains.includes(
        Number(chain.chainId)
      );
      const hasToken = chain.tokens?.length > 0;

      return hasChainConfig && !isExcludedChain && hasToken;
    });

    const chainMap = new Map<number, IMesonChain>();
    filteredChains.forEach((chain) => {
      chainMap.set(Number(chain.chainId), chain);
    });

    this.chains = filteredChains;
    this.chainMap = chainMap;
  }

  protected initTokens() {
    const chains = this.config;

    const tokenMap = new Map<number, IMesonToken[]>();
    const symbolMap = new Map<number, Map<string, IMesonToken>>();

    chains.forEach((chain) => {
      const chainId = Number(chain.chainId);

      const filteredTokens = chain.tokens.filter((token) => {
        const isExcludedToken = this.checkIsExcludedToken({
          excludedList: this.excludedTokens?.[chainId],
          tokenSymbol: token?.id?.toUpperCase(),
          tokenAddress: token.addr,
        });
        // native token transfer requires smart contract deployment. Ignore it for now.
        return !isExcludedToken && !isNativeToken(token.addr);
      });

      if (filteredTokens.length > 0 && this.chainMap.has(chainId)) {
        symbolMap.set(chainId, new Map<string, IMesonToken>());

        filteredTokens.forEach((token) => {
          symbolMap.get(chainId)?.set(token.id?.toUpperCase(), token);
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
      Map<number, Map<string, ITransferTokenPair<IMesonToken>>>
    >();

    this.chains.forEach((fromChain) => {
      this.chains.forEach((toChain) => {
        if (fromChain?.chainId !== toChain?.chainId) {
          const fromTokens = this.tokenMap.get(Number(fromChain.chainId)) ?? [];
          const transferableTokenMap = new Map<
            string,
            ITransferTokenPair<IMesonToken>
          >();
          fromTokens.forEach((fromToken) => {
            const toToken = this.getTransferToToken({
              fromChainId: Number(fromChain.chainId),
              toChainId: Number(toChain.chainId),
              fromTokenSymbol: fromToken.id?.toUpperCase(),
            });

            if (toToken) {
              const tokenPair: ITransferTokenPair<IMesonToken> = {
                fromChainId: Number(fromChain.chainId),
                toChainId: Number(toChain.chainId),
                fromToken,
                toToken,
                fromTokenAddress: fromToken.addr,
                toTokenAddress: toToken.addr,
              };
              transferableTokenMap.set(fromToken.id?.toUpperCase(), tokenPair);
            }
          });

          if (transferableTokenMap.size > 0) {
            if (!transferMap.has(Number(fromChain.chainId))) {
              transferMap.set(
                Number(fromChain.chainId),
                new Map<number, Map<string, ITransferTokenPair<IMesonToken>>>()
              );
            }
            transferMap
              .get(Number(fromChain.chainId))
              ?.set(Number(toChain.chainId), transferableTokenMap);
          }
        }
      });
    });

    this.transferMap = transferMap;
  }

  public getChainId(chain: IMesonChain) {
    return Number(chain.chainId);
  }

  public getTokenBaseInfo({
    chainId,
    token,
  }: {
    chainId: number;
    token: IMesonToken;
  }) {
    return {
      name: (token as any).id, // TODO
      symbol: token.id.toUpperCase(),
      address: token.addr ?? '0x0000000000000000000000000000000000000000',
      decimals: token.decimals,
      ...this.getTokenDisplaySymbolAndIcon({
        chainId,
        tokenAddress:
          token.addr ?? '0x0000000000000000000000000000000000000000',
        defaultSymbol: token.id.toUpperCase(),
      }),
    };
  }
}
