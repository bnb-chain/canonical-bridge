import { useQuery } from '@tanstack/react-query';

import { feApiClient } from '@/core/utils/client';

export function useFetchTransferConfig() {
  return useQuery<any>({
    queryKey: ['api/getTransferConfig'],
    queryFn: async () => {
      return (await feApiClient.get('api/getTransferConfig')).data;
    },
  });
}
