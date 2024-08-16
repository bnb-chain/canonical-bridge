import { cBridgeApiClient } from '@/src/cbridge/client';
import {
  CBridgeEstimateAmountRequest,
  CBridgeEstimateAmountResponse,
} from '@/src/cbridge/types';

// https://cbridge-docs.celer.network/developer/api-reference/gateway-estimateamt
export const getCBridgeEstimatedAmount = async (
  params: CBridgeEstimateAmountRequest
) => {
  return (
    await cBridgeApiClient.get<CBridgeEstimateAmountResponse>(
      `v2/estimateAmt`,
      {
        params,
      }
    )
  ).data;
};
