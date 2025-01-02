import { BaseAdapter } from '@/adapters/base';
import { ITokenPair } from '@/adapters/base/types';
import { stargateChainKey } from '@/adapters/stargate/const/stargateChainKey';
import {
  IStargateTransferConfig,
  IStargateBridgeTokenInfo,
  IStargateChain,
} from '@/adapters/stargate/types';
import { capitalizeFirst } from '@/shared/string';
import { BridgeType } from '@/shared/types';

export class StargateAdapter extends BaseAdapter<
  IStargateTransferConfig,
  IStargateChain,
  IStargateBridgeTokenInfo
> {
  public id: BridgeType = 'stargate';

  protected initChains() {
    const tokens = this.config;

    const filteredChains: IStargateChain[] = [];
    const filteredTokens = tokens.filter((token) => {
      const chainId = stargateChainKey[token.chainKey.toUpperCase()];
      if (!!chainId) {
        const endpointId = token.endpointID;
        if (!endpointId) {
          // eslint-disable-next-line no-console
          console.error(
            `Can not find Stargate token ${token.token.symbol} endpointID`
          );
          return false;
        }
        const hasChainConfig = !!this.chainConfigs.find(
          (e) => e.id === chainId
        );
        const isExcludedChain = this.excludedChains.includes(chainId);
        return hasChainConfig && !isExcludedChain;
      } else {
        return false;
      }
    });

    const chainMap = new Map<number, IStargateChain>();
    filteredTokens.forEach((token) => {
      const chainId = stargateChainKey[token.chainKey.toUpperCase()];
      // Do not add duplicate chain
      if (!chainMap.get(chainId)) {
        chainMap.set(chainId, {
          chainId: chainId,
          chainName: capitalizeFirst(token.chainName),
        });
        filteredChains.push({
          chainId: chainId,
          chainName: capitalizeFirst(token.chainName),
        });
      }
    });

    this.chains = filteredChains;
    this.chainMap = chainMap;
  }

  protected initTokens() {
    const tokens = this.config;

    const tokenMap = new Map<number, IStargateBridgeTokenInfo[]>();
    const symbolMap = new Map<
      number,
      Map<string, IStargateBridgeTokenInfo[]>
    >();

    const filteredTokens = tokens.filter((token, index) => {
      const chainId = stargateChainKey[token.chainKey.toUpperCase()];
      if (chainId) {
        const isExcludedToken = this.isExcludedToken({
          chainId,
          tokenSymbol: token.token.symbol?.toUpperCase(),
          tokenAddress: token.address,
        });

        const anotherTokenIndex = tokens.findIndex(
          (e, eIndex) =>
            e.token.symbol.toUpperCase() === token.token.symbol.toUpperCase() &&
            e.chainKey === token.chainKey &&
            eIndex !== index
        );
        const isDuplicatedToken =
          anotherTokenIndex > -1 && anotherTokenIndex !== index;

        if (isDuplicatedToken) {
          // eslint-disable-next-line no-console
          console.log(
            `Duplicate Stargate token ${token.token.symbol} symbol in ${token.chainName}`
          );
        }

        return !isExcludedToken && !isDuplicatedToken;
      }

      return false;
    });

    if (filteredTokens.length > 0) {
      filteredTokens.forEach((token) => {
        const chainId = stargateChainKey[token.chainKey.toUpperCase()];
        if (this.chainMap.has(chainId) && chainId) {
          if (!symbolMap.get(chainId)) {
            symbolMap.set(
              chainId,
              new Map<string, IStargateBridgeTokenInfo[]>()
            );
          }

          const tokenSymbol = token.token.symbol?.toUpperCase();
          if (!symbolMap.get(chainId)?.get(tokenSymbol)) {
            symbolMap.get(chainId)?.set(tokenSymbol, []);
          }
          symbolMap.get(chainId)?.get(tokenSymbol)?.push(token);

          const existTokens = tokenMap.get(chainId);
          if (existTokens && existTokens?.length > 0) {
            tokenMap.set(chainId, existTokens?.concat(token));
          } else {
            tokenMap.set(chainId, [token]);
          }
        }
      });
    }

    this.tokenMap = tokenMap;
    this.symbolMap = symbolMap;
  }

  protected initTransferMap() {
    const transferMap = new Map<
      number,
      Map<number, Map<string, ITokenPair<IStargateBridgeTokenInfo>[]>>
    >();

    this.chains.forEach((fromChain) => {
      this.chains.forEach((toChain) => {
        if (
          fromChain.chainId !== toChain.chainId &&
          fromChain.network === toChain.network
        ) {
          const fromTokens = this.tokenMap.get(fromChain.chainId) ?? [];

          const tokenPairsMap = new Map<
            string,
            ITokenPair<IStargateBridgeTokenInfo>[]
          >();
          fromTokens.forEach((fromToken) => {
            const toTokens = this.getToTokensForPair({
              fromChainId: fromChain.chainId,
              toChainId: toChain.chainId,
              fromTokenSymbol: fromToken.token.symbol?.toUpperCase(),
            });

            if (toTokens?.length) {
              const tokenPairs: ITokenPair<IStargateBridgeTokenInfo>[] = [];

              toTokens.forEach((toToken) => {
                tokenPairs.push({
                  fromChainId: fromChain.chainId,
                  toChainId: toChain.chainId,
                  fromToken,
                  toToken,
                  fromTokenAddress: fromToken.address,
                  toTokenAddress: toToken.address,
                });
              });

              tokenPairsMap.set(fromToken.address?.toLowerCase(), tokenPairs);
            }
          });

          if (tokenPairsMap.size > 0) {
            if (!transferMap.has(fromChain.chainId)) {
              transferMap.set(
                fromChain.chainId,
                new Map<
                  number,
                  Map<string, ITokenPair<IStargateBridgeTokenInfo>[]>
                >()
              );
            }
            transferMap
              .get(fromChain.chainId)
              ?.set(toChain.chainId, tokenPairsMap);
          }
        }
      });
    });

    this.transferMap = transferMap;
  }

  public getChainId(chain: IStargateChain) {
    return chain.chainId;
  }

  public getTokenBaseInfo({
    chainId,
    token,
  }: {
    chainId: number;
    token: IStargateBridgeTokenInfo;
  }) {
    return {
      name: token.token.symbol,
      symbol: token.token.symbol,
      address: token.token.address,
      decimals: token.token.decimals,
      ...this.getTokenDisplaySymbolAndIcon({
        chainId,
        tokenAddress: token.token.address,
        defaultSymbol: token.token.symbol,
      }),
    };
  }
}
