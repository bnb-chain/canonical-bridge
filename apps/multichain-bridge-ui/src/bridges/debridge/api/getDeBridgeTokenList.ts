import { deBridgeApiClient } from '@/bridges/debridge/client';

export const getDeBridgeTokenList = async (chainId: number) => {
  return (await deBridgeApiClient.get(`/token-list?chainId=${chainId}`)).data;
};
