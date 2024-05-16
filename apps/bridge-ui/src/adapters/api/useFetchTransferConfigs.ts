import { cBridgeApiClient } from '@/adapters/bridges/cbridge/client';
import { useQuery } from '@tanstack/react-query';

export function useFetchTransferConfigs() {
  return useQuery<any>({
    queryKey: ['transfer-configs'],
    queryFn: async () => {
      return (await cBridgeApiClient.get('v2/getTransferConfigsForAll')).data;
    },
  });
}
