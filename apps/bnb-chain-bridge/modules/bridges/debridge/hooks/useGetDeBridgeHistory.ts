import { useQuery } from '@tanstack/react-query';

import { deBridgeStatsApiClient } from '@/modules/bridges/debridge/client';

export const useGetDeBridgeHistory = (address: string, pageId = 0, pageSize = 20) => {
  return useQuery({
    queryKey: ['debridge-tx-history', address],
    queryFn: async () => {
      return deBridgeStatsApiClient.post('/Orders/filteredList', {
        filter: address,
        skip: pageId, // pagination
        take: pageSize, // row per page
        giveChainIds: [],
        takeChainIds: [],
      });
    },
    staleTime: 1000 * 10,
  });
};