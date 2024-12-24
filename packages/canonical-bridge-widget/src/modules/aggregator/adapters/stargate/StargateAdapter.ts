import { BridgeType, IStargateBridgeTokenInfo } from '@bnb-chain/canonical-bridge-sdk';

import {
  IStargateChain,
  IStargateApiTokenConfig,
} from '@/modules/aggregator/adapters/stargate/types';
import { BaseAdapter, ITransferTokenPair } from '@/modules/aggregator/shared/BaseAdapter';
import { stargateChainKey } from '@/modules/aggregator/adapters/stargate/const';
import { capitalizeFirst } from '@/core/utils/string';

export class StargateAdapter extends BaseAdapter<
  IStargateApiTokenConfig[],
  IStargateChain,
  IStargateBridgeTokenInfo
> {
  public bridgeType: BridgeType = 'stargate';

  protected initChains() {
    const tokens = this.config;

    const filteredChains: IStargateChain[] = [];
    const filteredTokens = tokens.filter((token) => {
      const chainId = stargateChainKey[token.chainKey.toUpperCase()];
      if (!!chainId) {
        const hasChainConfig = this.includedChains.includes(chainId);
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
    const symbolMap = new Map<number, Map<string, IStargateBridgeTokenInfo>>();
    const filteredTokens = tokens.filter((token) => {
      const chainId = stargateChainKey[token.chainKey.toUpperCase()];
      if (chainId) {
        const isExcludedToken = this.checkIsExcludedToken({
          excludedList: this.excludedTokens?.[chainId],
          tokenSymbol: token.token.symbol?.toUpperCase(),
          tokenAddress: token.address,
        });
        return !isExcludedToken;
      }
    });

    if (filteredTokens.length > 0) {
      filteredTokens.forEach((token) => {
        const chainId = stargateChainKey[token.chainKey.toUpperCase()];
        if (this.chainMap.has(chainId) && chainId) {
          const existToken = symbolMap.get(chainId);
          if (existToken) {
            // remove duplicate token
            const existTokenSymbol = symbolMap.get(chainId)?.get(token.token.symbol?.toUpperCase());
            if (existTokenSymbol) {
              symbolMap.get(chainId)?.delete(token.token.symbol?.toUpperCase());
              // eslint-disable-next-line no-console
              console.log(
                `Duplicate Stargate token ${token.token.symbol} symbol in ${token.chainName}`,
              );
            } else {
              symbolMap.get(chainId)?.set(token.token.symbol?.toUpperCase(), token);
            }
          } else {
            symbolMap.set(chainId, new Map<string, IStargateBridgeTokenInfo>());
            symbolMap.get(chainId)?.set(token.token.symbol?.toUpperCase(), token);
          }

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
      Map<number, Map<string, ITransferTokenPair<IStargateBridgeTokenInfo>>>
    >();

    this.chains.forEach((fromChain) => {
      this.chains.forEach((toChain) => {
        if (fromChain.chainId !== toChain.chainId && fromChain.network === toChain.network) {
          const fromTokens = this.tokenMap.get(fromChain.chainId) ?? [];

          const transferableTokenMap = new Map<
            string,
            ITransferTokenPair<IStargateBridgeTokenInfo>
          >();
          fromTokens.forEach((fromToken) => {
            const toToken = this.getToToken({
              fromChainId: fromChain.chainId,
              toChainId: toChain.chainId,
              fromTokenSymbol: fromToken.token.symbol?.toUpperCase(),
            });

            if (toToken) {
              const tokenPair: ITransferTokenPair<IStargateBridgeTokenInfo> = {
                fromChainId: fromChain.chainId,
                toChainId: toChain.chainId,
                fromToken,
                toToken,
                fromTokenAddress: fromToken.address,
                toTokenAddress: toToken.address,
              };
              transferableTokenMap.set(fromToken.token.symbol?.toUpperCase(), tokenPair);
            }
          });

          if (transferableTokenMap.size > 0) {
            if (!transferMap.has(fromChain.chainId)) {
              transferMap.set(
                fromChain.chainId,
                new Map<number, Map<string, ITransferTokenPair<IStargateBridgeTokenInfo>>>(),
              );
            }
            transferMap.get(fromChain.chainId)?.set(toChain.chainId, transferableTokenMap);
          }
        }
      });
    });

    this.transferMap = transferMap;
  }

  public getChainId(chain: IStargateChain) {
    return chain.chainId;
  }

  protected getChainIdAsObject(chainId: number) {
    return {
      chainId,
    };
  }

  public getTokenInfo({ chainId, token }: { chainId: number; token: IStargateBridgeTokenInfo }) {
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
