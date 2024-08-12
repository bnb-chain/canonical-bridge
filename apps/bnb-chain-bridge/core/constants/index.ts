export const DEBOUNCE_DELAY = 1500;
export const ESTIMATE_AMOUNT_DATA_RELOAD = 30000;

const BridgeList = ['cBridge', 'deBridge'];

export const EXPLORER_URL: Record<typeof BridgeList[number], string> = {
  cBridge: 'https://celerscan.com/tx/',
  deBridge: 'https://app.debridge.finance/orders?s=',
};
