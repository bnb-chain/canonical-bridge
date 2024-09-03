import { BridgeToken } from '@/modules/bridges/main/types';
import { env } from '@/core/configs/env';
import {
  CreateAdapterFuncReturnType,
  GetSelectedTokenPairParams,
} from '@/modules/bridges/main/utils/extendAdapters';

export interface MergeToTokenFuncParams {
  adapters: CreateAdapterFuncReturnType[];
  adapterParams: GetSelectedTokenPairParams;
}

export function mergeSelectedToToken(params: MergeToTokenFuncParams) {
  const { adapters, adapterParams } = params;

  let bridgeToken: BridgeToken | undefined;
  adapters.forEach((adapter) => {
    const { bridgeType } = adapter;
    const { tokenPair } = adapter.getSelectedTokenPair(adapterParams);

    const toToken = tokenPair?.toToken;
    const isPegged = !!tokenPair?.isPegged;
    const peggedPair = tokenPair?.peggedConfig;

    const formatted = toToken ? adapter.getTokenInfo(toToken) : undefined;

    if (toToken) {
      if (!bridgeToken) {
        bridgeToken = {
          ...formatted!,
          icon: `${env.ASSET_PREFIX}/images/tokens/${formatted?.symbol?.toUpperCase()}.png`,
          isPegged,
          peggedRawData: {},
          rawData: {},
          available: {},
        };
      }
      bridgeToken.peggedRawData = peggedPair;
      bridgeToken.rawData[bridgeType] = toToken;
      bridgeToken.available[bridgeType] = !!toToken;
    }
  });

  return bridgeToken;
}
