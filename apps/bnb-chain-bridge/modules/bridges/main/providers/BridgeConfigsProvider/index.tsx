import React, { useContext, useMemo } from 'react';

import { BridgeChain, BridgeConfigsResponse, BridgeToken } from '@/modules/bridges/main/types';
import { CBridgeBurnPairConfig, CBridgePeggedPairConfig } from '@/modules/bridges/cbridge/types';
import { useFetchBridgeConfigs } from '@/modules/bridges/main/api/useFetchBridgeConfigs';
import { mergeSupportedFromChains } from '@/modules/bridges/main/utils/mergeSupportedFromChains';
import { mergeSupportedToChains } from '@/modules/bridges/main/utils/mergeSupportedToChains';
import { mergeSupportedTokens } from '@/modules/bridges/main/utils/mergeSupportedTokens';
import { mergeSelectedToToken } from '@/modules/bridges/main/utils/mergeSelectedToToken';
import { createCBridgeAdapter } from '@/modules/bridges/cbridge/utils/createCBridgeAdapter';
import { createDeBridgeAdapter } from '@/modules/bridges/debridge/utils/createDeBridgeAdapter';
import { useAppSelector } from '@/core/store/hooks';
import { getNativeTokenMap } from '@/modules/bridges/main/utils/getNativeTokenMap';
import {
  GetSelectedTokenPairParams,
  GetSupportedFromChainsParams,
  GetSupportedToChainsParams,
  GetSupportedTokensParams,
} from '@/modules/bridges/main/utils/createAdapter';

export interface BridgeConfigsContextProps {
  isReady: boolean;
  defaultSelectedInfo: BridgeConfigsResponse['defaultSelectedInfo'];
  peggedPairConfigs: CBridgePeggedPairConfig[];
  burnPairConfigs: CBridgeBurnPairConfig[];
  getSupportedFromChains: (params: GetSupportedFromChainsParams) => BridgeChain[];
  getSupportedToChains: (params: GetSupportedToChainsParams) => BridgeChain[];
  getSupportedTokens: (params: GetSupportedTokensParams) => BridgeToken[];
  getSelectedToToken: (params: GetSelectedTokenPairParams) => BridgeToken | undefined;
}

const DEFAULT_CONTEXT: BridgeConfigsContextProps = {
  isReady: false,
  defaultSelectedInfo: {} as BridgeConfigsResponse['defaultSelectedInfo'],
  peggedPairConfigs: [],
  burnPairConfigs: [],
  getSupportedFromChains: () => [],
  getSupportedToChains: () => [],
  getSupportedTokens: () => [],
  getSelectedToToken: () => undefined,
};

export const BridgeConfigContext = React.createContext(DEFAULT_CONTEXT);

export interface BridgeConfigsProviderProps {
  children: React.ReactNode;
}

export function BridgeConfigsProvider(props: BridgeConfigsProviderProps) {
  const { children } = props;

  const { data } = useFetchBridgeConfigs();
  const evmConnectData = useAppSelector((state) => state.bridges.evmConnectData);

  const value = useMemo(() => {
    if (!data) {
      return DEFAULT_CONTEXT;
    }

    const nativeTokenMap = getNativeTokenMap(evmConnectData);
    const cBridgeAdapter = createCBridgeAdapter(data.cBridge, nativeTokenMap);
    const deBridgeAdapter = createDeBridgeAdapter(data.deBridge, nativeTokenMap);

    return {
      isReady: true,
      defaultSelectedInfo: data.defaultSelectedInfo,
      peggedPairConfigs: cBridgeAdapter.getPeggedPairConfigs(),
      burnPairConfigs: cBridgeAdapter.getBurnPairConfigs(),

      getSupportedFromChains: (params: GetSupportedFromChainsParams) => {
        return mergeSupportedFromChains({
          cBridge: cBridgeAdapter.getSupportedFromChains(params),
          deBridge: deBridgeAdapter.getSupportedFromChains(params),
          chainOrder: data.order.chain,
        });
      },
      getSupportedToChains: (params: GetSupportedToChainsParams) => {
        return mergeSupportedToChains({
          cBridge: cBridgeAdapter.getSupportedToChains(params),
          deBridge: deBridgeAdapter.getSupportedToChains(params),
          chainOrder: data.order.chain,
        });
      },
      getSupportedTokens: (params: GetSupportedTokensParams) => {
        return mergeSupportedTokens({
          cBridge: cBridgeAdapter.getSupportedTokens(params),
          deBridge: deBridgeAdapter.getSupportedTokens(params),
          tokenOrder: data.order.token,
        });
      },
      getSelectedToToken: (params: GetSelectedTokenPairParams) => {
        return mergeSelectedToToken({
          cBridge: cBridgeAdapter.getSelectedTokenPair(params),
          deBridge: deBridgeAdapter.getSelectedTokenPair(params),
        });
      },
    };
  }, [data, evmConnectData]);

  return <BridgeConfigContext.Provider value={value}>{children}</BridgeConfigContext.Provider>;
}

export function useBridgeConfigs() {
  return useContext(BridgeConfigContext);
}

export function usePeggedPairConfigs() {
  return useBridgeConfigs().peggedPairConfigs;
}

export function useBurnPairConfigs() {
  return useBridgeConfigs().burnPairConfigs;
}
