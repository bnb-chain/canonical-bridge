import { CBridgePeggedPairConfig } from '@bnb-chain/canonical-bridge-sdk';

import { formatTokenIcon } from '@/core/utils/string';
import { ITransferTokenPair } from '@/modules/aggregator/shared/BaseAdapter';
import { getDisplayTokenSymbol } from '@/modules/aggregator/shared/getDisplayTokenSymbol';
import { AdapterType, ITransferConfig, IBridgeToken } from '@/modules/aggregator/types';
import { isChainOrTokenCompatible } from '@/modules/aggregator/shared/isChainOrTokenCompatible';

export interface IGetTokensParams {
  fromChainId?: number;
  toChainId?: number;
}

export interface IAggregateTokensParams {
  adapters: AdapterType[];
  params: IGetTokensParams;
  config: ITransferConfig;
  assetsPrefix?: string;
}

export function aggregateTokens({
  adapters,
  params,
  config,
  assetsPrefix,
}: IAggregateTokensParams) {
  const tokenMap = new Map<string, IBridgeToken>();

  adapters.forEach((adapter) => {
    const { bridgeType } = adapter;
    const { compatibleTokens, tokenPairs } = adapter.getTokens({
      fromChainId: params.fromChainId!,
      toChainId: params.toChainId!,
    });

    tokenPairs.forEach((item: ITransferTokenPair<any>) => {
      const { fromToken, fromChainId, peggedConfig } = item;

      const baseInfo = adapter.getTokenInfo(fromToken);
      const displaySymbol = getDisplayTokenSymbol({
        symbolMap: config.displayTokenSymbols?.[fromChainId],
        defaultSymbol: baseInfo.symbol,
        tokenAddress: baseInfo.address,
      });

      let bridgeToken = tokenMap.get(displaySymbol.toUpperCase());
      const isCompatible = compatibleTokens.has(baseInfo.symbol.toUpperCase());

      if (!bridgeToken) {
        bridgeToken = {
          ...baseInfo,
          icon: formatTokenIcon(assetsPrefix, displaySymbol),
          displaySymbol,
          isPegged: !!item.isPegged,
        };
      }

      const common = {
        isCompatible,
        symbol: baseInfo.symbol,
        raw: isCompatible ? fromToken : undefined,
      };

      if (bridgeType === 'cBridge') {
        bridgeToken[bridgeType] = {
          ...common,
          peggedConfig: isCompatible ? (peggedConfig as CBridgePeggedPairConfig) : undefined,
        };
      } else {
        bridgeToken[bridgeType] = {
          ...common,
        };
      }

      tokenMap.set(displaySymbol.toUpperCase(), bridgeToken);
    });
  });

  const tokenOrder = config.order.tokens.map((item) => item.toUpperCase());

  const tokens = [...tokenMap.values()];
  tokens.sort((a, b) => {
    const isA = isChainOrTokenCompatible(a);
    const isB = isChainOrTokenCompatible(b);

    if (isA && !isB) {
      return -1;
    }
    if (!isA && isB) {
      return 1;
    }

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

  return tokens;
}
