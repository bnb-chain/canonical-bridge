import { stargateApiClient } from '@/src/stargate/client';
import { IStarGateBusDriveSettings } from '@/src/stargate/types';

// https://mainnet.stargate-api.com/v1/swagger
export const getStargateBusQueueTime = async (
  fromEndpointId: string,
  toEndpointId: string
) => {
  return (
    await stargateApiClient.get<IStarGateBusDriveSettings>(
      `${fromEndpointId}/${toEndpointId}`
    )
  ).data;
};
