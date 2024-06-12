import { cBridgeApiClient } from '@/bridges/cbridge/client';
import { CBridgeEstimateAmountResponse } from '@/bridges/cbridge/types';
import { useQuery } from '@tanstack/react-query';

export function useFetchCBridgeEstimateAmount(params: {
  srcChainId: number;
  dstChainId: number;
  tokenSymbol: string;
  amount: number;
  userAddress?: string;
  slippageTolerance: number;
  isPegged?: boolean;
}) {
  const params = {
    src_chain_id: params.srcChainId,
    dst_chain_id: params.dstChainId,
    token_symbol: params.tokenSymbol,
    amt: params.amount,
    usr_addr: params.userAddress,
    slippage_tolerance: params.slippageTolerance,
    is_pegged: params.isPegged,
  };

  return useQuery<CBridgeEstimateAmountResponse>({
    queryKey: ['cbridge/estimateAmt', JSON.stringify(params)],
    queryFn: async () => {
      return (
        await cBridgeApiClient.get(`v2/estimateAmt`, {
          params,
        })
      ).data;
    },
    enabled:
      !!params.srcChainId &&
      !!params.dstChainId &&
      !!params.tokenSymbol &&
      !!params.amount,
  });
}
