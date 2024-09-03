import { deBridgeApiClient } from '@/modules/bridges/debridge/client';

export const getDeBridgeTxQuote = async (urlParams: any) => {
  return (await deBridgeApiClient.get(`/dln/order/quote?${urlParams.toString()}`)).data;
};
