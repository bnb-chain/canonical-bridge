import React, { useContext, useMemo } from 'react';
import { NativeCurrency } from '@bnb-chain/canonical-bridge-sdk';

import {
  BridgeChain,
  BridgeConfigsResponse,
  BridgeToken,
  ChainConfig,
} from '@/modules/bridges/main/types';
import { CBridgeBurnPairConfig, CBridgePeggedPairConfig } from '@/modules/bridges/cbridge/types';
import { mergeSupportedChains } from '@/modules/bridges/main/utils/mergeSupportedChains';
import { mergeSupportedTokens } from '@/modules/bridges/main/utils/mergeSupportedTokens';
import { mergeSelectedToToken } from '@/modules/bridges/main/utils/mergeSelectedToToken';
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
  chainConfigs: ChainConfig[];
  bridgeConfigs: BridgeConfigsResponse;
  children: React.ReactNode;
}

export function BridgeConfigsProvider(props: BridgeConfigsProviderProps) {
  const { chainConfigs, bridgeConfigs, children } = props;

  const value = useMemo(() => {
    if (!bridgeConfigs) {
      return {
        ...DEFAULT_CONTEXT,
        chainConfigs,
      };
    }

    const nativeCurrencies = getNativeCurrencies(chainConfigs);

    const cBridgeAdapter = bridgeSDK.cBridge.createAdapter({
      configs: bridgeConfigs.cBridge.configs,
      excludedChains: bridgeConfigs.cBridge.exclude.chains,
      excludedTokens: bridgeConfigs.cBridge.exclude.tokens,
      bridgedTokenGroups: bridgeConfigs.cBridge.bridgedTokenGroups,
      nativeCurrencies,
    });

    const deBridgeAdapter = bridgeSDK.deBridge.createAdapter({
      configs: bridgeConfigs.deBridge.configs,
      excludedChains: bridgeConfigs.deBridge.exclude.chains,
      excludedTokens: bridgeConfigs.deBridge.exclude.tokens,
      bridgedTokenGroups: bridgeConfigs.deBridge.bridgedTokenGroups,
      nativeCurrencies,
    });

    const stargateAdapter = bridgeSDK.stargate.createAdapter({
      configs: bridgeConfigs.stargate.configs,
      excludedChains: bridgeConfigs.stargate.exclude.chains,
      excludedTokens: bridgeConfigs.stargate.exclude.tokens,
      bridgedTokenGroups: bridgeConfigs.stargate.bridgedTokenGroups,
      nativeCurrencies,
    });

    const layerZeroAdapter = bridgeSDK.layerZero.createAdapter({
      configs: bridgeConfigs.layerZero.configs,
      excludedChains: bridgeConfigs.layerZero.exclude.chains,
      excludedTokens: bridgeConfigs.layerZero.exclude.tokens,
      bridgedTokenGroups: bridgeConfigs.layerZero.bridgedTokenGroups,
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
      defaultSelectedInfo: bridgeConfigs.defaultSelectedInfo,
      defaultWallets: bridgeConfigs.defaultWallets,

      chainConfigs,
      nativeCurrencies,

      peggedPairConfigs: cBridgeAdapter.getPeggedPairConfigs(),
      burnPairConfigs: cBridgeAdapter.getBurnPairConfigs(),

      getSupportedFromChains: (params: GetSupportedFromChainsParams) => {
        return mergeSupportedChains({
          direction: 'from',
          adapters,
          adapterParams: params,
          chainOrder: bridgeConfigs.order.chain,
          defaultWallets: bridgeConfigs.defaultWallets,
          chainConfigs,
        });
      },
      getSupportedToChains: (params: GetSupportedToChainsParams) => {
        return mergeSupportedChains({
          direction: 'to',
          adapters,
          adapterParams: params,
          chainOrder: bridgeConfigs.order.chain,
          defaultWallets: bridgeConfigs.defaultWallets,
          chainConfigs,
        });
      },
      getSupportedTokens: (params: GetSupportedTokensParams) => {
        return mergeSupportedTokens({
          adapters,
          adapterParams: params,
          tokenOrder: bridgeConfigs.order.token,
        });
      },
      getSelectedToToken: (params: GetSelectedTokenPairParams) => {
        return mergeSelectedToToken({
          adapters,
          adapterParams: params,
        });
      },
    };
  }, [bridgeConfigs, chainConfigs]);

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
