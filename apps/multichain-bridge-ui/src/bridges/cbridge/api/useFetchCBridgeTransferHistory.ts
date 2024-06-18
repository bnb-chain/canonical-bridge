import { cBridgeApiClient } from '@/bridges/cbridge/client';
import { CBridgeTransferHistoryResponse } from '@/bridges/cbridge/types';
import { useQuery } from '@tanstack/react-query';

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
