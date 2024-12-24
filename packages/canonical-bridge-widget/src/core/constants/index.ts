export const DEBOUNCE_DELAY = 1500;

const BridgeList = ['cBridge', 'deBridge'];

export const EXPLORER_URL: Record<typeof BridgeList[number], string> = {
  cBridge: 'https://celerscan.com/tx/',
  deBridge: 'https://app.debridge.finance/orders?s=',
  // meson: 'https://testnet-explorer.meson.fi/swap/',
  meson: 'https://explorer.meson.fi/swap/',
};

export const STARGATE_QUEUE_URL = 'https://mainnet.stargate-api.com/v1/buses/bus-drive-settings';

export const DEFAULT_ADDRESS = '0x6836CbaCbBd1E798cC56802AC7d8BDf6Da0d0980';
export const DEFAULT_TRON_ADDRESS = 'TTb3A6ASFejJuGcM1UVcRCJA23WGiJKSiY';
export const DEFAULT_SOLANA_ADDRESS = 'J7JYXS8PMMBgfFKP1bqUu7mGgWyWUDL9xqfYujznc61r';

export const CBRIDGE_ENDPOINT = 'https://cbridge-prod2.celer.app/v2';
export const DEBRIDGE_ENDPOINT = 'https://deswap.debridge.finance/v1.0';
export const STARGATE_ENDPOINT = 'https://mainnet.stargate-api.com/v1/metadata?version=v2';
export const MESON_ENDPOINT = 'https://relayer.meson.fi/api/v1';

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

export const TIME = {
  SECOND: 1000,
  MINUTE: 1000 * 60,
  HOUR: 1000 * 60 * 60,
  DAY: 1000 * 60 * 60 * 24,
};

export const MIN_FEE = 0.0001;

export const REFETCH_INTERVAL = 8 * 1000;

export const MIN_SOL_TO_ENABLED_TX = 0.05;

export const EVM_NATIVE_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000';

export const SOLANA_NATIVE_TOKEN_ADDRESS = '11111111111111111111111111111111';

export const NON_EVM_CHAIN_ID_MAP = {
  tron: 728126428,
};
