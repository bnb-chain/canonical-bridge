import { formatTokenIcon } from '@/core/utils/string';
import { getDisplayTokenSymbol } from '@/modules/aggregator/shared/getDisplayTokenSymbol';
import { AdapterType, IBridgeChain, IBridgeConfig, IBridgeToken } from '@/modules/aggregator/types';

export interface IGetToTokenParams {
  fromChain: IBridgeChain;
  toChain: IBridgeChain;
  token: IBridgeToken;
}

export interface IAggregateToTokenParams {
  adapters: AdapterType[];
  params: IGetToTokenParams;
  config: IBridgeConfig;
}

export function aggregateToToken({ adapters, params, config }: IAggregateToTokenParams) {
  let bridgeToken: IBridgeToken | undefined;

  adapters.forEach((adapter) => {
    const { bridgeType } = adapter;

    const tokenSymbol = params.token?.[bridgeType]?.symbol?.toUpperCase() as string;
    const { tokenPair } = adapter.getTokenPair({
      fromChainId: params.fromChain?.id,
      toChainId: params.toChain?.id,
      tokenSymbol,
    }) as any;

    const toToken = tokenPair?.toToken;

    if (toToken) {
      const baseInfo = adapter.getTokenInfo(toToken);

      if (!bridgeToken) {
        const displaySymbol = getDisplayTokenSymbol({
          symbolMap: config.displayTokenSymbols?.[tokenPair.toChainId],
          defaultSymbol: baseInfo.symbol,
          tokenAddress: baseInfo.address,
        });
        bridgeToken = {
          ...baseInfo,
          displaySymbol,
          icon: formatTokenIcon(displaySymbol),
          isPegged: !!tokenPair?.isPegged,
        };
      }

      const common = {
        isCompatible: true,
        symbol: baseInfo.symbol,
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
