import { deBridgeApiClient } from '@/bridges/debridge/client';

export const getDeBridgeSupportedChainInfo = async () => {
  return (await deBridgeApiClient.get('/supported-chains-info')).data;
};
