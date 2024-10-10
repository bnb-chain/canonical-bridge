import { AdapterType, IBridgeToken } from '@/modules/aggregator/types';

export interface IGetToTokenParams {
  fromChainId: number;
  toChainId: number;
  token: IBridgeToken;
}

export interface IAggregateToTokenParams {
  adapters: AdapterType[];
  params: IGetToTokenParams;
}

export function aggregateToToken({ adapters, params }: IAggregateToTokenParams) {
  let bridgeToken: IBridgeToken | undefined;

  adapters.forEach((adapter) => {
    const { bridgeType } = adapter;

    const { tokenPair } = adapter.getTokenPair({
      fromChainId: params.fromChainId,
      toChainId: params.toChainId,
      tokenSymbol: params.token?.[bridgeType]?.symbol?.toUpperCase() as string,
    }) as any;

    const toToken = tokenPair?.toToken;

    if (toToken) {
      const baseInfo = adapter.getTokenInfo({
        chainId: tokenPair.toChainId,
        token: toToken,
      });

      if (!bridgeToken) {
        bridgeToken = {
          ...baseInfo,
          isPegged: !!tokenPair?.isPegged,
        };
      }

      const common = {
        ...baseInfo,
        isCompatible: true,
        isMatched: true,
        raw: toToken,
      };

      if (bridgeType === 'cBridge') {
        bridgeToken[bridgeType] = {
          ...common,
          peggedConfig: tokenPair.peggedConfig,
        };
      } else {
        bridgeToken[bridgeType] = {
          ...common,
        };
      }
    }
  });

  return bridgeToken;
}
