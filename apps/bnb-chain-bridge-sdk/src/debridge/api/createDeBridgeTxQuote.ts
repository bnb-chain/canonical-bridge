import { deBridgeApiClient } from '@/src/debridge/client';
import { DeBridgeCreateQuoteResponse } from '@/src/debridge/types';

export const createDeBridgeTxQuote = async (urlParams: any) => {
  return (
    await deBridgeApiClient.get<DeBridgeCreateQuoteResponse>(
      `/dln/order/create-tx?${urlParams.toString()}`,
    )
  ).data;
};
