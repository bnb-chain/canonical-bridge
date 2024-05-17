import { cBridgeApiClient } from '@/bridges/cbridge/client';
import { ICBridgeTransferConfig } from '@/bridges/cbridge/types';
import { useQuery } from '@tanstack/react-query';

export function useFetchCBridgeTransferConfigs() {
  return useQuery<ICBridgeTransferConfig>({
    queryKey: ['cbridge-transfer-configs'],
    queryFn: async () => {
      return (await cBridgeApiClient.get('v2/getTransferConfigsForAll')).data;
    },
  });
}
