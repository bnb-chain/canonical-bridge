import { CBridgePeggedPairConfig } from '@bnb-chain/canonical-bridge-sdk';

import { ITransferTokenPair } from '@/modules/aggregator/shared/BaseAdapter';
import { AdapterType, IBridgeToken } from '@/modules/aggregator/types';

export interface IGetTokensParams {
  fromChainId?: number;
  toChainId?: number;
}

export interface IAggregateTokensParams {
  adapters: AdapterType[];
  params: IGetTokensParams;
}

export function aggregateTokens({ adapters, params }: IAggregateTokensParams) {
  const tokenMap = new Map<string, IBridgeToken>();

  adapters.forEach((adapter) => {
    const { bridgeType } = adapter;

    const { compatibleTokens, tokenPairs } = adapter.getTokens({
      fromChainId: params.fromChainId!,
      toChainId: params.toChainId!,
    });

    tokenPairs.forEach((item: ITransferTokenPair<any>) => {
      const { fromToken, fromChainId, peggedConfig } = item;

      const baseInfo = adapter.getTokenInfo({
        chainId: fromChainId,
        token: fromToken,
      });
      let bridgeToken = tokenMap.get(baseInfo.displaySymbol.toUpperCase());
      const isCompatible = compatibleTokens.has(baseInfo.symbol.toUpperCase());

      if (!bridgeToken) {
        bridgeToken = {
          ...baseInfo,
          isPegged: !!item.isPegged,
        };
      }

      // update base info
      if (isCompatible) {
        bridgeToken = {
          ...bridgeToken,
          address: baseInfo.address,
          decimals: baseInfo.decimals,
        };
      }

      const common = {
        ...baseInfo,
        isCompatible,
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

      tokenMap.set(baseInfo.displaySymbol.toUpperCase(), bridgeToken);
    });
  });

  const tokens = [...tokenMap.values()];
  return tokens;
}
