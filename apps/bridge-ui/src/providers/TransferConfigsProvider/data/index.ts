import * as mainnetConfigs from './mainnet';
import * as testnetConfigs from './testnet';
import { env } from '@/configs/env';

const data = env.NETWORK === 'mainnet' ? mainnetConfigs : testnetConfigs;

const { CBRIDGE_TRANSFER_CONFIGS, DEBRIDGE_CHAIN_LIST, DEBRIDGE_TOKENS } = data;
export { CBRIDGE_TRANSFER_CONFIGS, DEBRIDGE_CHAIN_LIST, DEBRIDGE_TOKENS };
