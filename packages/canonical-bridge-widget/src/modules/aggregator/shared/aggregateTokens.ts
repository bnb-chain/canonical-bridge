import { formatTokenIcon } from '@/core/utils/string';
import { getDisplayTokenSymbol } from '@/modules/aggregator/shared/getDisplayTokenSymbol';
import { AdapterType, IBridgeConfig, IBridgeToken } from '@/modules/aggregator/types';

export interface IGetTokensParams {
  fromChainId?: number;
  toChainId?: number;
}

export interface IAggregateTokensParams {
  adapters: AdapterType[];
  params: IGetTokensParams;
  config: IBridgeConfig;
}

export function aggregateTokens({ adapters, params, config }: IAggregateTokensParams) {
  const finalTokens: IBridgeToken[] = [];
  const finalTokenMap = new Map<string, IBridgeToken>();

  adapters.forEach((adapter) => {
    const { bridgeType } = adapter;
    const { compatibleTokens, tokenPairs } = adapter.getTokens({
      fromChainId: params.fromChainId!,
      toChainId: params.toChainId!,
    });

    tokenPairs.forEach((item: any) => {
      const { fromToken, fromChainId, peggedConfig } = item;

      const baseInfo = adapter.getTokenInfo(fromToken);
      const displaySymbol = getDisplayTokenSymbol({
        symbolMap: config.displayTokenSymbols?.[fromChainId],
        defaultSymbol: baseInfo.symbol,
        tokenAddress: baseInfo.address,
      });

      let bridgeToken = finalTokenMap.get(displaySymbol.toUpperCase());
      const isCompatible = compatibleTokens.has(baseInfo.symbol);

      if (!bridgeToken) {
        bridgeToken = {
          ...baseInfo,
          icon: formatTokenIcon(displaySymbol),
          displaySymbol,
          isPegged: !!item.isPegged,
        };
        finalTokens.push(bridgeToken);
        finalTokenMap.set(displaySymbol, bridgeToken);
      }

      const common = {
        isCompatible,
        symbol: baseInfo.symbol,
        raw: isCompatible ? fromToken : undefined,
      };

      if (bridgeType === 'cBridge') {
        bridgeToken[bridgeType] = {
          ...common,
          peggedConfig: isCompatible ? peggedConfig : undefined,
        };
      } else {
        bridgeToken[bridgeType] = {
          ...common,
        };
      }
    });
  });

  const tokenOrder = config.order.tokens.map((item) => item.toUpperCase());

  finalTokens.sort((a, b) => {
    const indexA = tokenOrder.indexOf(a.displaySymbol.toUpperCase());
    const indexB = tokenOrder.indexOf(b.displaySymbol.toUpperCase());

    if (indexA > -1 && indexB === -1) {
      return -1;
    }
    if (indexA === -1 && indexB > -1) {
      return 1;
    }
    if (indexA > -1 && indexB > -1) {
      return indexA - indexB;
    }

    return a.displaySymbol < b.displaySymbol ? -1 : 1;
  });

  return finalTokens;
}
