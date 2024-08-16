import { deBridgeApiClient } from '@/src/debridge/client';
import { DeBridgeCreateQuoteResponse } from '@/src/debridge/types';

// https://deswap.debridge.finance/v1.0/#/DLN/DlnOrderControllerV10_createOrder
export const createDeBridgeTxQuote = async (urlParams: any) => {
  return (
    await deBridgeApiClient.get<DeBridgeCreateQuoteResponse>(
      `/dln/order/create-tx?${urlParams.toString()}`,
    )
  ).data;
};
