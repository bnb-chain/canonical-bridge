import React, { useContext, useMemo } from 'react';

import {
  BridgeChain,
  BridgeConfigsResponse,
  BridgeToken,
  ChainConfig,
} from '@/modules/bridges/main/types';
import { CBridgeBurnPairConfig, CBridgePeggedPairConfig } from '@/modules/bridges/cbridge/types';
import { useFetchBridgeConfigs } from '@/modules/bridges/main/api/useFetchBridgeConfigs';
import { mergeSupportedChains } from '@/modules/bridges/main/utils/mergeSupportedChains';
import { mergeSupportedTokens } from '@/modules/bridges/main/utils/mergeSupportedTokens';
import { mergeSelectedToToken } from '@/modules/bridges/main/utils/mergeSelectedToToken';
import { createCBridgeAdapter } from '@/modules/bridges/cbridge/utils/createCBridgeAdapter';
import { createDeBridgeAdapter } from '@/modules/bridges/debridge/utils/createDeBridgeAdapter';
import { createStarGateAdapter } from '@/modules/bridges/stargate/utils/createStarGateAdapter';
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
  defaultWallets: BridgeConfigsResponse['defaultWallets'];
  peggedPairConfigs: CBridgePeggedPairConfig[];
  burnPairConfigs: CBridgeBurnPairConfig[];
  chainConfigs: ChainConfig[];
  nativeCurrencyMap: Map<number, ChainConfig['nativeCurrency']>;
  getSupportedFromChains: (params: GetSupportedFromChainsParams) => BridgeChain[];
  getSupportedToChains: (params: GetSupportedToChainsParams) => BridgeChain[];
  getSupportedTokens: (params: GetSupportedTokensParams) => BridgeToken[];
  getSelectedToToken: (params: GetSelectedTokenPairParams) => BridgeToken | undefined;
}

const DEFAULT_CONTEXT: BridgeConfigsContextProps = {
  isReady: false,
  defaultSelectedInfo: {} as BridgeConfigsResponse['defaultSelectedInfo'],
  defaultWallets: {
    evm: {
      pc: [],
      mobile: [],
    },
    solana: {
      pc: [],
      mobile: [],
    },
  },
  peggedPairConfigs: [],
  burnPairConfigs: [],
  chainConfigs: [],
  nativeCurrencyMap: new Map<number, ChainConfig['nativeCurrency']>(),
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
  const chainConfigs = useAppSelector((state) => state.bridges.chainConfigs);

  const value = useMemo(() => {
    if (!data) {
      return {
        ...DEFAULT_CONTEXT,
        chainConfigs,
      };
    }

    const nativeCurrencyMap = getNativeTokenMap(chainConfigs);
    const cBridgeAdapter = createCBridgeAdapter(data.cBridge, nativeCurrencyMap);
    const deBridgeAdapter = createDeBridgeAdapter(data.deBridge, nativeCurrencyMap);
    const stargateAdapter = createStarGateAdapter(data.stargate, nativeCurrencyMap);

    return {
      isReady: true,
      defaultSelectedInfo: data.defaultSelectedInfo,
      defaultWallets: data.defaultWallets,

      chainConfigs,
      nativeCurrencyMap,

      peggedPairConfigs: cBridgeAdapter.getPeggedPairConfigs(),
      burnPairConfigs: cBridgeAdapter.getBurnPairConfigs(),

      getSupportedFromChains: (params: GetSupportedFromChainsParams) => {
        return mergeSupportedChains({
          direction: 'from',
          adapters: [cBridgeAdapter, deBridgeAdapter, stargateAdapter],
          adapterParams: params,
          chainOrder: data.order.chain,
          defaultWallets: data.defaultWallets,
          chainConfigs,
        });
      },
      getSupportedToChains: (params: GetSupportedToChainsParams) => {
        return mergeSupportedChains({
          direction: 'to',
          adapters: [cBridgeAdapter, deBridgeAdapter, stargateAdapter],
          adapterParams: params,
          chainOrder: data.order.chain,
          defaultWallets: data.defaultWallets,
          chainConfigs,
        });
      },
      getSupportedTokens: (params: GetSupportedTokensParams) => {
        return mergeSupportedTokens({
          adapters: [cBridgeAdapter, deBridgeAdapter, stargateAdapter],
          adapterParams: params,
          tokenOrder: data.order.token,
        });
      },
      getSelectedToToken: (params: GetSelectedTokenPairParams) => {
        return mergeSelectedToToken({
          adapters: [cBridgeAdapter, deBridgeAdapter, stargateAdapter],
          adapterParams: params,
        });
      },
    };
  }, [data, chainConfigs]);

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
