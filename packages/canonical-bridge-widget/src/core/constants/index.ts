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
