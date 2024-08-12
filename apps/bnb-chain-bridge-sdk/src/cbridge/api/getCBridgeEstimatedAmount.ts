import { cBridgeApiClient } from '@/src/cbridge/client';
import { CBridgeEstimateAmountRequest } from '@/src/cbridge/types';

export const getCBridgeEstimatedAmount = async (
  params: CBridgeEstimateAmountRequest
) => {
  return (
    await cBridgeApiClient.get(`v2/estimateAmt`, {
      params,
    })
  ).data;
};
