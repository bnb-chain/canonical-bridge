import { useFetchCBridgeTransferConfigs } from '@/bridges/cbridge/api/useFetchCBridgeTransferConfigs';
import {
  CBridgeChain,
  CBridgePeggedPairConfig,
  CBridgeToken,
  CBridgeTransferConfigResponse,
} from '@/bridges/cbridge/types';
import React, { useMemo } from 'react';

export interface BridgeConfigContextProps {
  chainsMap: Map<number, CBridgeChain>;
  chainTokensMap: Map<number, CBridgeToken[]>;
  farmingRewardContractAddr: CBridgeTransferConfigResponse['farming_reward_contract_addr'];
  peggedPairConfigs: CBridgePeggedPairConfig[];
}

export const BridgeConfigContext = React.createContext(
  {} as BridgeConfigContextProps
);

export interface BridgeConfigProviderProps {
  children: React.ReactNode;
}

export function BridgeConfigProvider(props: BridgeConfigProviderProps) {
  const { children } = props;

  const { data } = useFetchCBridgeTransferConfigs();

  const value = useMemo(() => {
    return getTransferConfig(data);
  }, [data]);

  return (
    <BridgeConfigContext.Provider value={value}>
      {children}
    </BridgeConfigContext.Provider>
  );
}

function getTransferConfig(config = {} as CBridgeTransferConfigResponse) {
  const {
    chains = [],
    chain_token = {},
    farming_reward_contract_addr = '',
    pegged_pair_configs = [],
  } = config;

  const chainsMap = new Map<number, CBridgeChain>();
  const chainTokensMap = new Map<number, CBridgeToken[]>();

  chains.forEach((chainItem) => {
    chainsMap.set(chainItem.id, chainItem);

    const tokens = chain_token[chainItem.id]?.token;
    if (tokens?.length > 0) {
      chainTokensMap.set(chainItem.id, tokens);
    }
  });

  const checkPeggedPair = (chainId: number, token: CBridgeToken) => {
    const hasChainInfo = chainsMap.has(chainId);
    const isEnabledToken = !token.token.xfer_disabled;

    return hasChainInfo && isEnabledToken;
  };

  const filteredPeggedPairConfigs = pegged_pair_configs.filter((ppItem) => {
    return (
      checkPeggedPair(ppItem.org_chain_id, ppItem.org_token) &&
      checkPeggedPair(ppItem.pegged_chain_id, ppItem.pegged_token)
    );
  });

  return {
    chainsMap,
    chainTokensMap,
    farmingRewardContractAddr: farming_reward_contract_addr,
    peggedPairConfigs: filteredPeggedPairConfigs,
  };
}
