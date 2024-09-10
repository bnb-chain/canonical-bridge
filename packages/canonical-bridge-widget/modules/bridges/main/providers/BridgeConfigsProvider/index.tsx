import React, { useContext, useMemo } from 'react';
import { NativeCurrency } from '@bnb-chain/canonical-bridge-sdk';

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
import { useAppSelector } from '@/modules/store/StoreProvider';
import { getNativeCurrencies } from '@/modules/bridges/main/utils/getNativeCurrencies';
import { bridgeSDK } from '@/core/constants/bridgeSDK';
import {
  extendAdapters,
  GetSelectedTokenPairParams,
  GetSupportedFromChainsParams,
  GetSupportedToChainsParams,
  GetSupportedTokensParams,
} from '@/modules/bridges/main/utils/extendAdapters';

export interface BridgeConfigsContextProps {
  isReady: boolean;
  defaultSelectedInfo: BridgeConfigsResponse['defaultSelectedInfo'];
  defaultWallets: BridgeConfigsResponse['defaultWallets'];
  peggedPairConfigs: CBridgePeggedPairConfig[];
  burnPairConfigs: CBridgeBurnPairConfig[];
  chainConfigs: ChainConfig[];
  nativeCurrencies: Record<number, NativeCurrency>;
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
  },
  peggedPairConfigs: [],
  burnPairConfigs: [],
  chainConfigs: [],
  nativeCurrencies: {},
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

    const nativeCurrencies = getNativeCurrencies(chainConfigs);

    const cBridgeAdapter = bridgeSDK.cBridge.createAdapter({
      configs: data.cBridge.configs,
      excludedChains: data.cBridge.exclude.chains,
      excludedTokens: data.cBridge.exclude.tokens,
      bridgedTokenGroups: data.cBridge.bridgedTokenGroups,
      nativeCurrencies,
    });

    const deBridgeAdapter = bridgeSDK.deBridge.createAdapter({
      configs: data.deBridge.configs,
      excludedChains: data.deBridge.exclude.chains,
      excludedTokens: data.deBridge.exclude.tokens,
      bridgedTokenGroups: data.deBridge.bridgedTokenGroups,
      nativeCurrencies,
    });

    const stargateAdapter = bridgeSDK.stargate.createAdapter({
      configs: data.stargate.configs,
      excludedChains: data.stargate.exclude.chains,
      excludedTokens: data.stargate.exclude.tokens,
      bridgedTokenGroups: data.stargate.bridgedTokenGroups,
      nativeCurrencies,
    });

    const layerZeroAdapter = bridgeSDK.layerZero.createAdapter({
      configs: data.layerZero.configs,
      excludedChains: data.layerZero.exclude.chains,
      excludedTokens: data.layerZero.exclude.tokens,
      bridgedTokenGroups: data.layerZero.bridgedTokenGroups,
      nativeCurrencies,
    });

    const adapters = extendAdapters([
      cBridgeAdapter,
      deBridgeAdapter,
      stargateAdapter,
      layerZeroAdapter,
    ]);

    return {
      isReady: true,
      defaultSelectedInfo: data.defaultSelectedInfo,
      defaultWallets: data.defaultWallets,

      chainConfigs,
      nativeCurrencies,

      peggedPairConfigs: cBridgeAdapter.getPeggedPairConfigs(),
      burnPairConfigs: cBridgeAdapter.getBurnPairConfigs(),

      getSupportedFromChains: (params: GetSupportedFromChainsParams) => {
        return mergeSupportedChains({
          direction: 'from',
          adapters,
          adapterParams: params,
          chainOrder: data.order.chain,
          defaultWallets: data.defaultWallets,
          chainConfigs,
        });
      },
      getSupportedToChains: (params: GetSupportedToChainsParams) => {
        return mergeSupportedChains({
          direction: 'to',
          adapters,
          adapterParams: params,
          chainOrder: data.order.chain,
          defaultWallets: data.defaultWallets,
          chainConfigs,
        });
      },
      getSupportedTokens: (params: GetSupportedTokensParams) => {
        return mergeSupportedTokens({
          adapters,
          adapterParams: params,
          tokenOrder: data.order.token,
        });
      },
      getSelectedToToken: (params: GetSelectedTokenPairParams) => {
        return mergeSelectedToToken({
          adapters,
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
