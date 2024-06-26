import { BridgeConfigsResponse } from '@/bridges/main';
import { feApiClient } from '@/bridges/main/client';
import { useQuery } from '@tanstack/react-query';

export function useFetchBridgeConfigs() {
  return useQuery<BridgeConfigsResponse>({
    queryKey: ['api/getConfigs'],
    queryFn: async () => {
      return (await feApiClient.get('api/getConfigs')).data;
    },
  });
}
