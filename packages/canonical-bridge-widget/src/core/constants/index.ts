export const DEBOUNCE_DELAY = 1500;
export const ESTIMATE_AMOUNT_DATA_RELOAD = 30000;

const BridgeList = ['cBridge', 'deBridge'];

export const EXPLORER_URL: Record<typeof BridgeList[number], string> = {
  cBridge: 'https://celerscan.com/tx/',
  deBridge: 'https://app.debridge.finance/orders?s=',
};

export const DEBRIDGE_ACCESS_TOKEN = 'bnb-48deda482665';
export const STARGATE_QUEUE_URL = 'https://mainnet.stargate-api.com/v1/buses/bus-drive-settings';

export const DEFAULT_ADDRESS = '0x6836CbaCbBd1E798cC56802AC7d8BDf6Da0d0980';

export const nativeTokenMap = {
  1: 'ETH',
  10: 'ETH',
  56: 'BNB',
  137: 'MATIC',
  250: 'FTM',
  8453: 'ETH',
  42161: 'ETH',
  43114: 'ETH',
  59144: 'ETH',
  // 7565164: 'SOL',
  100000001: 'NEON',
  1380012617: 'ETH',
};

export const CLIENT_TIME_OUT = 60 * 1000;

export const APP_NAME = 'bnb-chain-bridge';

export const SOURCE_MAX_RECENT_COUNT = 4;

export const SOURCE_MAX_MORE_COUNT = 10;

export const SOURCE_RECENT_NETWORKS_STORAGE_KEY = `${APP_NAME}-source-recent-networks`;

export const OP_BNB_SUPPORTED_TOKENS = ['BNB', 'BTCB', 'WETH', 'FDUSD', 'USDT', 'XCAD']; // WETH corresponds to ETH of opBNB bridge

export const BSC_CHAIN_ID = 56;

export const OP_BNB_CHAIN_ID = 204;