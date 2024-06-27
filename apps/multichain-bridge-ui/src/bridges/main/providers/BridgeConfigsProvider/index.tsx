import { CBridgePeggedPairConfig } from '@/bridges/cbridge/types';
import { useFetchBridgeConfigs } from '@/bridges/main/api/useFetchBridgeConfigs';
import {
  BridgeConfigsResponse,
  ChainInfo,
  MultiBurnPairConfig,
  TokenInfo,
} from '@/bridges/main/types';
import { getBridgeChainTokensMap } from '@/bridges/main/utils/getBridgeChainTokensMap';
import { getBridgeChains } from '@/bridges/main/utils/getBridgeChains';
import { getMultiBurnConfigs } from '@/bridges/main/utils/getMultiBurnConfigs';
import { getPeggedPairConfigs } from '@/bridges/main/utils/getPeggedPairConfigs';
import { getBridgeTokens } from '@/bridges/main/utils/getBridgeTokens';
import React, { useContext, useMemo } from 'react';

export interface BridgeConfigsContextProps {
  isReady: boolean;
  peggedPairConfigs: CBridgePeggedPairConfig[];
  multiBurnConfigs: MultiBurnPairConfig[];
  rawData: BridgeConfigsResponse;
  chains: ChainInfo[];
  chainTokensMap: Record<number, TokenInfo[]>;
  getSupportedFromChains: () => ChainInfo[];
  getSupportedToChains: (fromChainId: number) => ChainInfo[];
  getSupportedTokens: (fromChainId: number, toChainId: number) => TokenInfo[];
}

const DEFAULT_CONTEXT: BridgeConfigsContextProps = {
  isReady: false,
  chains: [],
  chainTokensMap: {},
  peggedPairConfigs: [],
  multiBurnConfigs: [],
  rawData: {} as any,
  getSupportedFromChains: () => [],
  getSupportedToChains: () => [],
  getSupportedTokens: () => [],
};

export const BridgeConfigContext = React.createContext(DEFAULT_CONTEXT);

export interface BridgeConfigsProviderProps {
  children: React.ReactNode;
}

export function BridgeConfigsProvider(props: BridgeConfigsProviderProps) {
  const { children } = props;

  const { data } = useFetchBridgeConfigs();

  const value = useMemo(() => {
    if (!data) {
      return DEFAULT_CONTEXT;
    }

    const peggedPairConfigs = getPeggedPairConfigs({
      cbridgeChains: data.cbridge.chains,
      peggedPairConfigs: data.cbridge.pegged_pair_configs,
    });

    const multiBurnConfigs = getMultiBurnConfigs({
      peggedPairConfigs,
    });

    const { chains, cbridgeToChainIdMap, debridgeToChainIdMap } = getBridgeChains({
      peggedPairConfigs,
      multiBurnConfigs,
      rawData: data,
    });

    const chainTokensMap = getBridgeChainTokensMap({
      cbridgeTokens: data.cbridge.chain_token,
      deBridgeTokens: data.debridge.chain_token,
    });

    return {
      isReady: true,
      chains,
      peggedPairConfigs,
      multiBurnConfigs,
      rawData: data,
      chainTokensMap,
      getSupportedFromChains() {
        return chains;
      },
      getSupportedToChains(fromChainId: number) {
        const cbridgeToChainIdSet = cbridgeToChainIdMap.get(fromChainId);
        const deBridgeToChainIdSet = debridgeToChainIdMap.get(fromChainId);

        const toChains = chains.filter(
          (item) => cbridgeToChainIdSet?.has(item.id) || deBridgeToChainIdSet?.has(item.id),
        );

        return toChains;
      },
      getSupportedTokens(fromChainId: number, toChainId: number) {
        return getBridgeTokens({
          fromChainId,
          toChainId,
          chainTokensMap,
          peggedPairConfigs,
        });
      },
    };
  }, [data]);

  return <BridgeConfigContext.Provider value={value}>{children}</BridgeConfigContext.Provider>;
}

export function useBridgeConfigs() {
  return useContext(BridgeConfigContext);
}

export function usePeggedPairConfigs() {
  return useBridgeConfigs().peggedPairConfigs;
}

export function useMultiBurnConfigs() {
  return useBridgeConfigs().multiBurnConfigs;
}
