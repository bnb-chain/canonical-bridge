import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';

import {
  ILayerZeroTransferConfig,
  ILayerZeroChain,
  ILayerZeroToken,
} from '@/modules/aggregator/adapters/layerZero/types';
import { BaseAdapter, ITransferTokenPair } from '@/modules/aggregator/shared/BaseAdapter';

export class LayerZeroAdapter extends BaseAdapter<
  ILayerZeroTransferConfig,
  ILayerZeroChain,
  ILayerZeroToken
> {
  public bridgeType: BridgeType = 'layerZero';

  protected initChains() {
    const { chains, tokens } = this.config;

    const filteredChains = chains.filter((chain) => {
      const hasChainConfig = this.includedChains.includes(chain.chainId);
      const isExcludedChain = this.excludedChains.includes(chain.chainId);
      const hasToken = tokens[chain.chainId]?.length > 0;
      return hasChainConfig && !isExcludedChain && hasToken;
    });

    const chainMap = new Map<number, ILayerZeroChain>();
    filteredChains.forEach((chain) => {
      chainMap.set(chain.chainId, chain);
    });

    this.chains = filteredChains;
    this.chainMap = chainMap;
  }

  protected initTokens() {
    const { tokens } = this.config;

    const tokenMap = new Map<number, ILayerZeroToken[]>();
    const symbolMap = new Map<number, Map<string, ILayerZeroToken>>();
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
        symbolMap.set(chainId, new Map<string, ILayerZeroToken>());

        filteredTokens.forEach((token) => {
          symbolMap.get(chainId)?.set(token.symbol, token);
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
      Map<number, Map<string, ITransferTokenPair<ILayerZeroToken>>>
    >();

    this.chains.forEach((fromChain) => {
      this.chains.forEach((toChain) => {
        if (fromChain.chainId !== toChain.chainId && fromChain.network === toChain.network) {
          const fromTokens = this.tokenMap.get(fromChain.chainId) ?? [];

          const transferableTokenMap = new Map<string, ITransferTokenPair<ILayerZeroToken>>();
          fromTokens.forEach((fromToken) => {
            const toToken = this.getToToken({
              fromChainId: fromChain.chainId,
              toChainId: toChain.chainId,
              fromTokenSymbol: fromToken.symbol?.toUpperCase(),
            });

            if (toToken) {
              const tokenPair: ITransferTokenPair<ILayerZeroToken> = {
                fromChainId: fromChain.chainId,
                toChainId: toChain.chainId,
                fromToken,
                toToken,
                fromTokenAddress: fromToken.address,
                toTokenAddress: toToken.address,
              };
              transferableTokenMap.set(fromToken.symbol, tokenPair);
            }
          });

          if (transferableTokenMap.size > 0) {
            if (!transferMap.has(fromChain.chainId)) {
              transferMap.set(
                fromChain.chainId,
                new Map<number, Map<string, ITransferTokenPair<ILayerZeroToken>>>(),
              );
            }
            transferMap.get(fromChain.chainId)?.set(toChain.chainId, transferableTokenMap);
          }
        }
      });
    });

    this.transferMap = transferMap;
  }

  public getChainId(chain: ILayerZeroChain) {
    return chain.chainId;
  }

  protected getChainIdAsObject(chainId: number) {
    return {
      chainId,
    };
  }

  public getTokenInfo({ chainId, token }: { chainId: number; token: ILayerZeroToken }) {
    return {
      name: (token as any).name, // TODO
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
