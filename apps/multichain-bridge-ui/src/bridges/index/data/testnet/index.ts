// cbridge
import cBridgeTransferConfigs from '@/bridges/cbridge/data/testnet/transfer_configs.json';

// debridge
import deBridgeChainList from '@/bridges/debridge/data/testnet/chain_list.json';
import deBridgeTokenList1 from '@/bridges/debridge/data/testnet/token_list/chain_id_1.json';
import deBridgeTokenList10 from '@/bridges/debridge/data/testnet/token_list/chain_id_10.json';
import deBridgeTokenList56 from '@/bridges/debridge/data/testnet/token_list/chain_id_56.json';
import deBridgeTokenList137 from '@/bridges/debridge/data/testnet/token_list/chain_id_137.json';
import deBridgeTokenList8453 from '@/bridges/debridge/data/testnet/token_list/chain_id_8453.json';
import deBridgeTokenList42161 from '@/bridges/debridge/data/testnet/token_list/chain_id_42161.json';
import deBridgeTokenList43114 from '@/bridges/debridge/data/testnet/token_list/chain_id_43114.json';
import deBridgeTokenList59144 from '@/bridges/debridge/data/testnet/token_list/chain_id_59144.json';
import deBridgeTokenList7565164 from '@/bridges/debridge/data/testnet/token_list/chain_id_7565164.json';
import deBridgeTokenList100000001 from '@/bridges/debridge/data/testnet/token_list/chain_id_100000001.json';
import deBridgeTokenList100000002 from '@/bridges/debridge/data/testnet/token_list/chain_id_100000002.json';
import deBridgeTokenList100000003 from '@/bridges/debridge/data/testnet/token_list/chain_id_100000003.json';

export const CBRIDGE_TRANSFER_CONFIGS = cBridgeTransferConfigs;

export const DEBRIDGE_CHAIN_LIST = deBridgeChainList;

export const DEBRIDGE_TOKENS = {
  1: Object.values(deBridgeTokenList1.tokens),
  10: Object.values(deBridgeTokenList10.tokens),
  56: Object.values(deBridgeTokenList56.tokens),
  137: Object.values(deBridgeTokenList137.tokens),
  8453: Object.values(deBridgeTokenList8453.tokens),
  42161: Object.values(deBridgeTokenList42161.tokens),
  43114: Object.values(deBridgeTokenList43114.tokens),
  59144: Object.values(deBridgeTokenList59144.tokens),
  7565164: Object.values(deBridgeTokenList7565164.tokens),
  100000001: Object.values(deBridgeTokenList100000001.tokens),
  100000002: Object.values(deBridgeTokenList100000002.tokens),
  100000003: Object.values(deBridgeTokenList100000003.tokens),
};
