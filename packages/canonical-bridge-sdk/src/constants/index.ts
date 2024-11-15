export const env = {
  CBRIDGE_ENDPOINT: 'https://cbridge-prod2.celer.app',
  DEBRIDGE_ENDPOINT: 'https://deswap.debridge.finance/v1.0',
  DEBRIDGE_STATS_ENDPOINT: 'https://stats-api.dln.trade/api',
  MESON_ENDPOINT: 'https://relayer.meson.fi/api/v1',
  STARGATE_ENDPOINT: 'https://mainnet.stargate-api.com/v1',
};

export const CLIENT_TIME_OUT = 60 * 1000;

export const ESTIMATE_AMOUNT_DATA_RELOAD = 30000;

const ExplorerList = ['cBridge', 'deBridge'];

export const EXPLORER_URL: Record<(typeof ExplorerList)[number], string> = {
  cBridge: 'https://celerscan.com/tx/',
  deBridge: 'https://app.debridge.finance/orders?s=',
};

export const DEFAULT_SLIPPAGE = 10000;
