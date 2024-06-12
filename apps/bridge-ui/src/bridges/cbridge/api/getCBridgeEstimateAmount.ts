import { cBridgeApiClient } from '@/bridges/cbridge/client';
import { CBridgeEstimateAmountRequest } from '@/bridges/cbridge/types';

export const getCBridgeEstimateAmount = async (
  params: CBridgeEstimateAmountRequest
) => {
  return (
    await cBridgeApiClient.get(`v2/estimateAmt`, {
      params,
    })
  ).data;
};
