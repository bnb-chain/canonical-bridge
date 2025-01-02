import { BaseAdapter } from '@/adapters/base';
import { ITokenPair } from '@/adapters/base/types';
import {
  IMesonChain,
  IMesonToken,
  IMesonTransferConfig,
} from '@/adapters/meson/types';
import { EVM_NATIVE_TOKEN_ADDRESS } from '@/constants';
import { isNativeToken } from '@/shared/address';
import { BridgeType } from '@/shared/types';

export const TRON_CHAIN_ID = 728126428;

export class MesonAdapter extends BaseAdapter<
  IMesonTransferConfig,
  IMesonChain,
  IMesonToken
> {
  public id: BridgeType = 'meson';

  protected initChains() {
    const chains = this.config;

    const filteredChains = chains.filter((chain) => {
      const hasChainConfig = this.chainConfigs.find(
        (e) => e.id === this.getChainId(chain)
      );
      const isExcludedChain = this.excludedChains.includes(
        this.getChainId(chain)
      );
      const hasToken = chain.tokens?.length > 0;
      return hasChainConfig && !isExcludedChain && hasToken;
    });

    const chainMap = new Map<number, IMesonChain>();
    filteredChains.forEach((chain) => {
      const chainId = this.getChainId(chain);
      if (!!Number(chainId)) {
        chainMap.set(chainId, chain);
      }
    });

    this.chains = filteredChains;
    this.chainMap = chainMap;
  }

  protected initTokens() {
    const chains = this.config;

    const tokenMap = new Map<number, IMesonToken[]>();
    const symbolMap = new Map<number, Map<string, IMesonToken[]>>();

    chains.forEach((chain) => {
      const chainId = this.getChainId(chain);

      const filteredTokens = chain.tokens.filter((token, tokenIndex) => {
        const tokenAddress = token.addr ?? EVM_NATIVE_TOKEN_ADDRESS;

        const isExcludedToken = this.isExcludedToken({
          chainId,
          tokenSymbol: token?.symbol?.toUpperCase(),
          tokenAddress,
        });

        const anotherTokenIndex = chain.tokens.findIndex(
          (e, eIndex) =>
            e.symbol.toUpperCase() === token.symbol.toUpperCase() &&
            eIndex !== tokenIndex
        );
        const isDuplicatedToken =
          anotherTokenIndex > -1 && anotherTokenIndex !== tokenIndex;

        if (isDuplicatedToken) {
          // eslint-disable-next-line no-console
          console.log(
            `Duplicate Meson token ${token.symbol} symbol in ${chain.name}`
          );
        }

        // native token transfer requires smart contract deployment. Ignore it for now.
        return (
          !isExcludedToken && !isDuplicatedToken && !isNativeToken(tokenAddress)
        );
      });

      if (filteredTokens.length > 0 && this.chainMap.has(chainId)) {
        symbolMap.set(chainId, new Map<string, IMesonToken[]>());

        filteredTokens.forEach((token) => {
          const tokenSymbol = token.symbol?.toUpperCase();
          if (!symbolMap.get(chainId)?.get(tokenSymbol)) {
            symbolMap.get(chainId)?.set(tokenSymbol, []);
          }
          symbolMap.get(chainId)?.get(tokenSymbol)?.push(token);
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
      Map<number, Map<string, ITokenPair<IMesonToken>[]>>
    >();

    this.chains.forEach((fromChain) => {
      this.chains.forEach((toChain) => {
        if (fromChain?.chainId !== toChain?.chainId) {
          const fromChainId = this.getChainId(fromChain);
          const toChainId = this.getChainId(toChain);

          const fromTokens = this.tokenMap.get(fromChainId) ?? [];
          const tokenPairsMap = new Map<string, ITokenPair<IMesonToken>[]>();

          fromTokens.forEach((fromToken) => {
            const toTokens = this.getToTokensForPair({
              fromChainId,
              toChainId,
              fromTokenSymbol: fromToken.symbol?.toUpperCase(),
            });

            if (toTokens?.length) {
              const tokenPairs: ITokenPair<IMesonToken>[] = [];

              toTokens.forEach((toToken) => {
                tokenPairs.push({
                  fromChainId,
                  toChainId,
                  fromToken,
                  toToken,
                  fromTokenAddress: fromToken.addr,
                  toTokenAddress: toToken.addr,
                });
              });

              tokenPairsMap.set(fromToken.addr?.toLowerCase(), tokenPairs);
            }
          });

          if (tokenPairsMap.size > 0) {
            if (!transferMap.has(fromChainId)) {
              transferMap.set(
                fromChainId,
                new Map<number, Map<string, ITokenPair<IMesonToken>[]>>()
              );
            }
            transferMap.get(fromChainId)?.set(toChainId, tokenPairsMap);
          }
        }
      });
    });

    this.transferMap = transferMap;
  }

  public getChainId(chain: IMesonChain) {
    return chain.chainId === 'tron' ? TRON_CHAIN_ID : Number(chain.chainId);
  }

  public getTokenBaseInfo({
    chainId,
    token,
  }: {
    chainId: number;
    token: IMesonToken;
  }) {
    const tokenAddress = token.addr ?? EVM_NATIVE_TOKEN_ADDRESS;

    return {
      name: token.name?.toUpperCase(), // TODO
      symbol: token.symbol.toUpperCase(),
      address: tokenAddress,
      decimals: token.decimals,
      ...this.getTokenDisplaySymbolAndIcon({
        chainId,
        tokenAddress,
        defaultSymbol: token.symbol,
      }),
    };
  }
}
