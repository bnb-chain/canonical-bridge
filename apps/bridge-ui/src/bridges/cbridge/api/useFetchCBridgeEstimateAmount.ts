import { getCBridgeEstimateAmount } from '@/bridges/cbridge/api/getCBridgeEstimateAmount';
import { CBridgeEstimateAmountResponse } from '@/bridges/cbridge/types';
import { useQuery } from '@tanstack/react-query';

export function useFetchCBridgeEstimateAmount({
  srcChainId,
  dstChainId,
  tokenSymbol,
  amount,
  userAddress,
  slippageTolerance,
  isPegged = false,
}: {
  srcChainId: number;
  dstChainId: number;
  tokenSymbol: string;
  amount: number;
  userAddress?: string;
  slippageTolerance: number;
  isPegged?: boolean;
}) {
  const params = {
    src_chain_id: srcChainId,
    dst_chain_id: dstChainId,
    token_symbol: tokenSymbol,
    amt: amount,
    usr_addr: userAddress,
    slippage_tolerance: slippageTolerance,
    is_pegged: isPegged,
  };

  return useQuery<CBridgeEstimateAmountResponse>({
    queryKey: ['cbridge/estimateAmt', JSON.stringify(params)],
    queryFn: async () => {
      return getCBridgeEstimateAmount(params);
    },
    enabled: !!srcChainId && !!dstChainId && !!tokenSymbol && !!amount,
  });
}
