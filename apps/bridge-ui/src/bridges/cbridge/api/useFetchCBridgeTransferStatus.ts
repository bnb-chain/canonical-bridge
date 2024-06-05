import { cBridgeApiClient } from '@/bridges/cbridge/client';
import { CBridgeTransferStatusResponse } from '@/bridges/cbridge/types';
import { useQuery } from '@tanstack/react-query';

export function useFetchCBridgeTransferStatus({
  transferId,
}: {
  transferId: string;
}) {
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
          }
        )
      ).data;
    },
  });
}
