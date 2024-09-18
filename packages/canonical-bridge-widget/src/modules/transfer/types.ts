import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';

import { IQuoteResponse } from '@/modules/aggregator/adapters/deBridge/types';

export interface ITransferActionInfo {
  data?: `0x${string}`;
  bridgeAddress?: `0x${string}`;
  value?: string;
  bridgeType?: BridgeType;
  orderId?: string; // deBridge order id. May be used for tracking history
}

export interface IReceiveValue {
  deBridge?: string;
  cBridge?: string;
  stargate?: string;
  layerZero?: string;
}

export interface IEstimatedAmount {
  cBridge?: any;
  deBridge?: IQuoteResponse;
  stargate?: any; // TODO: response from quoteOFT
  layerZero?: any;
}
