import { bridgeSDK } from '@/core/constants/bridgeSDK';
import { CBridgeEstimateAmountRequest } from '@/modules/bridges/cbridge/types';

export const getCBridgeEstimateAmount = async (params: CBridgeEstimateAmountRequest) => {
  return await bridgeSDK.cBridge.getEstimatedAmount(params);
};
