import {
  CBridgeChainInfo,
  CBridgePeggedPairConfig,
  CBridgeTokenInfo,
} from '@/bridges/cbridge/types';
import {
  DeBridgetChainDetails,
  DeBridgeTokenDetails,
} from '@/bridges/debridge/types';

export type BridgeType = 'cbridge' | 'debridge';

export interface ChainInfo {
  id: number;
  name: string;
  icon?: string;
  tags: BridgeType[];
  rawData: {
    cbridge?: CBridgeChainInfo;
    debridge?: DeBridgetChainDetails;
  };
}

export interface TokenInfo {
  name: string;
  icon?: string;
  address: string;
  symbol: string;
  decimal: number;
  tags: BridgeType[];
  rawData: {
    cbridge?: CBridgeTokenInfo;
    debridge?: DeBridgeTokenDetails;
  };
  isPegged?: boolean;
  peggedRawData?: {
    cbridge: CBridgePeggedPairConfig;
  };
}

export interface TransferActionInfo {
  data?: `0x${string}`;
  bridgeAddress?: `0x${string}`;
  value?: string;
  bridgeType?: BridgeType;
}

export interface BurnConfig {
  chain_id: number;
  token: CBridgeTokenInfo;
  burn_contract_addr: string;
  canonical_token_contract_addr: string;
  burn_contract_version: number;
}

/// burn_config_as_org.bridge_version === 2
/// burn_config_as_dst.bridge_version is not required
/// If the bridge_version of burnConfig1 and burnConfig2 are 2,
/// There should be two MultiBurnPairConfigs
/// 1: burnConfig1 ----> burnConfig2
/// 2: burnConfig2 ----> burnConfig1
export interface MultiBurnPairConfig {
  burn_config_as_org: BurnConfig; /// Could be used only as from chain
  burn_config_as_dst: BurnConfig; /// Could be used only as to chain
}
