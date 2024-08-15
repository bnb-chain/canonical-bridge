import { stargateApiClient } from "@/src/stargate/client";
import { IStarGateBusDriveSettings } from "@/src/stargate/types";

export const getStargateBusQueueTime = async (fromEndpointId: string, toEndpointId: string) => {  
  return (await stargateApiClient.get<IStarGateBusDriveSettings>(`${fromEndpointId}/${toEndpointId}`)).data;
}