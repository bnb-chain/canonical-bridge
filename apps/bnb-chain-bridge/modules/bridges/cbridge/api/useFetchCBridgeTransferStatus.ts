import { useQuery } from '@tanstack/react-query';

import { cBridgeApiClient } from '@/modules/bridges/cbridge/client';
import { CBridgeTransferStatusResponse } from '@/modules/bridges/cbridge/types';

export function useFetchCBridgeTransferStatus({ transferId }: { transferId: string }) {
  return useQuery<CBridgeTransferStatusResponse>({
    queryKey: ['cbridge/getTransferStatus', transferId],
    queryFn: async () => {
      return (
        await cBridgeApiClient.post(
          `v2/getTransferStatus`,
          {
            transfer_id: transferId,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
      ).data;
    },
  });
}
