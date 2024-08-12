import { useQuery } from '@tanstack/react-query';

import { cBridgeApiClient } from '@/modules/bridges/cbridge/client';
import { CBridgeTransferEstimatedTime } from '@/modules/bridges/cbridge/types';

export const useFetchCBridgeTransferWaitingTime = ({
  srcChainId,
  dstChainId,
}: {
  srcChainId: number;
  dstChainId: number;
}) => {
  const params = {
    src_chain_id: srcChainId,
    dst_chain_id: dstChainId,
  };

  return useQuery<CBridgeTransferEstimatedTime>({
    queryKey: ['cbridge/estimateTime', JSON.stringify(params)],
    queryFn: async () => {
      return (
        await cBridgeApiClient.get(`v2/getLatest7DayTransferLatencyForQuery`, {
          params,
        })
      ).data;
    },
    enabled: !!srcChainId && !!dstChainId,
    staleTime: 1000 * 60 * 30,
  });
};
