import { BaseAdapter } from '@/adapters/base';
import { ITokenPair } from '@/adapters/base/types';
import {
  ILayerZeroChain,
  ILayerZeroToken,
  ILayerZeroTransferConfig,
} from '@/adapters/layerZero/types';
import { BridgeType } from '@/shared/types';

export class LayerZeroAdapter extends BaseAdapter<
  ILayerZeroTransferConfig,
  ILayerZeroChain,
  ILayerZeroToken
> {
  public id: BridgeType = 'layerZero';

  protected initChains() {
    const { chains, tokens } = this.config;

    const filteredChains = chains.filter((chain) => {
      const hasChainConfig = !!this.chainConfigs.find(
        (e) => e.id === chain.chainId
      );
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
    const symbolMap = new Map<number, Map<string, ILayerZeroToken[]>>();
    Object.entries(tokens).forEach(([id, chainTokens]) => {
      const chainId = Number(id);

      const filteredTokens = chainTokens.filter((token) => {
        const isExcludedToken = this.isExcludedToken({
          chainId,
          tokenSymbol: token.symbol?.toUpperCase(),
          tokenAddress: token.address,
        });
        return !isExcludedToken;
      });

      if (filteredTokens.length > 0 && this.chainMap.has(chainId)) {
        symbolMap.set(chainId, new Map<string, ILayerZeroToken[]>());

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
      Map<number, Map<string, ITokenPair<ILayerZeroToken>[]>>
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
            ITokenPair<ILayerZeroToken>[]
          >();
          fromTokens.forEach((fromToken) => {
            const toTokens = this.getToTokensForPair({
              fromChainId: fromChain.chainId,
              toChainId: toChain.chainId,
              fromTokenSymbol: fromToken.symbol?.toUpperCase(),
            });

            if (toTokens?.length) {
              const tokenPairs: ITokenPair<ILayerZeroToken>[] = [];

              toTokens.forEach((toToken) => {
                tokenPairs.push({
                  fromChainId: fromChain.chainId,
                  toChainId: toChain.chainId,
                  fromTokenAddress: fromToken.address,
                  toTokenAddress: toToken.address,
                  fromToken,
                  toToken,
                });
              });

              tokenPairsMap.set(fromToken.address?.toLowerCase(), tokenPairs);
            }
          });

          if (tokenPairsMap.size > 0) {
            if (!transferMap.has(fromChain.chainId)) {
              transferMap.set(
                fromChain.chainId,
                new Map<number, Map<string, ITokenPair<ILayerZeroToken>[]>>()
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

  public getChainId(chain: ILayerZeroChain) {
    return chain.chainId;
  }

  public getTokenBaseInfo({
    chainId,
    token,
  }: {
    chainId: number;
    token: ILayerZeroToken;
  }) {
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
