import { useQuery } from '@tanstack/react-query';

import { cBridgeApiClient } from '@/modules/bridges/cbridge/client';
import { CBridgeTransferHistoryResponse } from '@/modules/bridges/cbridge/types';

export function useFetchCBridgeTransferHistory({
  nextPageToken,
  pageSize,
  accounts,
}: {
  nextPageToken?: string;
  pageSize: number;
  accounts: string[];
}) {
  const params = {
    'acct_addr[]': accounts.join(','),
    next_page_token: nextPageToken,
    page_size: pageSize,
  };

  return useQuery<CBridgeTransferHistoryResponse>({
    queryKey: ['cbridge/transferHistory', JSON.stringify(params)],
    queryFn: async () => {
      return (
        await cBridgeApiClient.get(`v2/transferHistory`, {
          params: params,
        })
      ).data;
    },
  });
}
