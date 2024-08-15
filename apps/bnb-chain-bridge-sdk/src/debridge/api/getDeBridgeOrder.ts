import { deBridgeApiClient } from '@/src/debridge/client';

// https://deswap.debridge.finance/v1.0/#/DLN/DlnOrderControllerV10_getOrder
export const getDeBridgeOrder = async (id: string) => {
  return (await deBridgeApiClient.get(`/dln/order/${id}`)).data;
};
