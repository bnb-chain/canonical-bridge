import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';

export interface ITransferActionInfo {
  data?: `0x${string}`;
  bridgeAddress?: `0x${string}`;
  value?: string;
  bridgeType?: BridgeType;
  orderId?: string; // deBridge order id. May be used for tracking history
}

export type IReceiveValue = {
  [key in BridgeType]?: string;
};

export type IEstimatedAmount = {
  [key in BridgeType]?: any; // TODO: response from quoteOFT
};

export type IBridgeError = {
  [key in BridgeType]?: any;
};

export type IFeeBreakDown = {
  label: string;
  value: string;
}[];
export interface IRouteFeeDetails {
  breakdown: IFeeBreakDown;
  summary: string;
}

export type IRouteFees = {
  [key in BridgeType]?: IRouteFeeDetails;
};
