import { cBridgeApiClient } from '@/bridges/cbridge/client';
import { CBridgeTransferConfigResponse } from '@/bridges/cbridge/types';
import { useQuery } from '@tanstack/react-query';

export function useFetchCBridgeTransferConfigs() {
  return useQuery<CBridgeTransferConfigResponse>({
    queryKey: ['cbridge/getTransferConfigsForAll'],
    queryFn: async () => {
      return (await cBridgeApiClient.get('v2/getTransferConfigsForAll')).data;
    },
  });
}
