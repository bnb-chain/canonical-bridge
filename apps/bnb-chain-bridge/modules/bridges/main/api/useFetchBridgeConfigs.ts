import { useQuery } from '@tanstack/react-query';

import { BridgeConfigsResponse } from '@/modules/bridges/main';
import { feApiClient } from '@/core/utils/client';

export function useFetchBridgeConfigs() {
  return useQuery<BridgeConfigsResponse>({
    queryKey: ['api/getConfigs'],
    queryFn: async () => {
      return (await feApiClient.get('api/getConfigs')).data;
    },
  });
}
