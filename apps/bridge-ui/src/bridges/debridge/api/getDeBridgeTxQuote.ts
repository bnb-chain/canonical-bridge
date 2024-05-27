import { deBridgeApiClient } from '@/bridges/debridge/client';
// TODO: Remove any
export const getDeBridgeTxQuote = async (urlParams: any) => {
  return (
    await deBridgeApiClient.get(`/dln/order/create-tx?${urlParams.toString()}`)
  ).data;
};
