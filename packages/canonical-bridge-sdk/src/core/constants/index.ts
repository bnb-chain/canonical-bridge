export const CLIENT_TIME_OUT = 60 * 1000;

export const ESTIMATE_AMOUNT_DATA_RELOAD = 30000;

const ExplorerList = ['cBridge', 'deBridge'];

export const EXPLORER_URL: Record<(typeof ExplorerList)[number], string> = {
  cBridge: 'https://celerscan.com/tx/',
  deBridge: 'https://app.debridge.finance/orders?s=',
};
