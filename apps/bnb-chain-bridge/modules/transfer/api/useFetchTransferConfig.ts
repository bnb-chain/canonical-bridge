import { useQuery } from '@tanstack/react-query';

import { feApiClient } from '@/core/utils/client';

export function useFetchTransferConfig() {
  return useQuery<any>({
    queryKey: ['api/getConfigs'],
    queryFn: async () => {
      return (await feApiClient.get('api/getConfigs')).data;
    },
  });
}
