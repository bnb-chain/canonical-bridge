import { env } from '@/core/configs/env';
import { BridgeToken } from '@/modules/bridges';
import { isAvailableChainOrToken } from '@/modules/bridges/main/utils/isAvailableChainOrToken';
import {
  CreateAdapterFuncReturnType,
  GetSupportedTokensParams,
} from '@/modules/bridges/main/utils/createAdapter';

export interface MergeSupportedTokensFuncParams {
  adapters: CreateAdapterFuncReturnType[];
  adapterParams: GetSupportedTokensParams;
  tokenOrder: string[];
}

export function mergeSupportedTokens(params: MergeSupportedTokensFuncParams) {
  const { tokenOrder, adapters, adapterParams } = params;

  const tokens: BridgeToken[] = [];
  const existingMap = new Map<string, BridgeToken>();

  adapters.forEach((adapter) => {
    const { bridgeType, getTokenInfo } = adapter;
    const { availableTokens, tokenPairs } = adapter.getSupportedTokens(adapterParams);

    tokenPairs.forEach((item) => {
      const { fromToken } = item;
      const formatted = getTokenInfo(fromToken);

      const existingToken = existingMap.get(formatted.address?.toUpperCase());
      const isAvailable = availableTokens.has(formatted.symbol);

      if (existingToken) {
        existingToken.rawData[bridgeType] = isAvailable ? fromToken : undefined;
        existingToken.available[bridgeType] = isAvailable;
      } else {
        const bridgeToken: BridgeToken = {
          ...formatted,
          icon: `${env.ASSET_PREFIX}/images/tokens/${formatted.symbol?.toUpperCase()}.png`,
          isPegged: !!item.isPegged,
          rawData: {
            [bridgeType]: isAvailable ? fromToken : undefined,
          },
          available: {
            [bridgeType]: isAvailable,
          },
          peggedRawData: {
            [bridgeType]: item.peggedPair,
          },
        };
        tokens.push(bridgeToken);
        existingMap.set(formatted.address?.toUpperCase(), bridgeToken);
      }
    });
  });

  const order = tokenOrder.map((item) => item.toUpperCase());

  tokens.sort((a, b) => {
    const isA = isAvailableChainOrToken(a);
    const isB = isAvailableChainOrToken(b);

    if (isA && !isB) {
      return -1;
    }
    if (!isA && isB) {
      return 1;
    }

    const indexA = order.indexOf(a.symbol.toUpperCase());
    const indexB = order.indexOf(b.symbol.toUpperCase());

    if (indexA > -1 && indexB === -1) {
      return -1;
    }
    if (indexA === -1 && indexB > -1) {
      return 1;
    }
    if (indexA > -1 && indexB > -1) {
      return indexA - indexB;
    }

    return a.symbol < b.symbol ? -1 : 1;
  });

  return tokens;
}
