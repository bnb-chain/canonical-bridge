import { CBridgeChainInfo, CBridgeTokenInfo } from '@/bridges/cbridge/types';
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
}
