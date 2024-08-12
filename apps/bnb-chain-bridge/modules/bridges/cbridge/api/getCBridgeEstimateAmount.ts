import { cBridgeApiClient } from '@/modules/bridges/cbridge/client';
import { CBridgeEstimateAmountRequest } from '@/modules/bridges/cbridge/types';

export const getCBridgeEstimateAmount = async (params: CBridgeEstimateAmountRequest) => {
  return (
    await cBridgeApiClient.get(`v2/estimateAmt`, {
      params,
    })
  ).data;
};
