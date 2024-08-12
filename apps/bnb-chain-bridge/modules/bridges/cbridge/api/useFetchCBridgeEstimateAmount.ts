import { useQuery } from '@tanstack/react-query';

import { getCBridgeEstimateAmount } from '@/modules/bridges/cbridge/api/getCBridgeEstimateAmount';
import { CBridgeEstimateAmountResponse } from '@/modules/bridges/cbridge/types';

export function useFetchCBridgeEstimateAmount(value: {
  srcChainId: number;
  dstChainId: number;
  tokenSymbol: string;
  amount: string;
  userAddress?: string;
  slippageTolerance: number;
  isPegged?: boolean;
}) {
  const params = {
    src_chain_id: value.srcChainId,
    dst_chain_id: value.dstChainId,
    token_symbol: value.tokenSymbol,
    amt: value.amount,
    usr_addr: value.userAddress,
    slippage_tolerance: value.slippageTolerance,
    is_pegged: value.isPegged,
  };

  return useQuery<CBridgeEstimateAmountResponse>({
    queryKey: ['cbridge/estimateAmt', JSON.stringify(params)],
    queryFn: async () => {
      return getCBridgeEstimateAmount(params);
    },
    enabled: !!value.srcChainId && !!value.dstChainId && !!value.tokenSymbol && !!value.amount,
  });
}
