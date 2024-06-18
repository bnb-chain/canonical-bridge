import { deBridgeApiClient } from '@/bridges/debridge/client';
import { useQuery } from '@tanstack/react-query';

export const useFetchDeBridgeOrderQuote = (params: {
  srcChainId: string; // src chain id
  srcChainTokenIn: string; // asset address
  srcChainTokenInAmount: string; // asset amount
  dstChainId: string; // destination chain id
  dstChainTokenOut: string; // destination asset address
  dstChainTokenOutAmount?: string; // destination asset amount. This property can be set to "auto" so that the API will suggest the best possible outcome of the order based on current market conditions and the protocol fees, keeping the order in a reasonable-to-fullfill state
  additionalTakerRewardBps?: number;
  srcIntermediaryTokenAddress?: string;
  dstIntermediaryTokenAddress?: string;
  dstIntermediaryTokenSpenderAddress?: string;
  intermediaryTokenUSDPrice?: string;
  slippage?: number;
  affiliateFeePercent?: number;
  prependOperatingExpenses?: boolean;
}) => {
  const urlParams = new URLSearchParams(params as any);
  [...urlParams.entries()].forEach(([key, value]) => {
    if (!value || value === 'undefined') {
      urlParams.delete(key);
    }
  });
  return useQuery<any>({
    queryKey: [
      'debridge-order-quote',
      params.srcChainId,
      params.srcChainTokenIn,
      params.srcChainTokenInAmount,
      params.dstChainId,
      params.dstChainTokenOut,
    ],
    queryFn: async () => {
      return (
        await deBridgeApiClient.get(`/dln/order/quote?${urlParams.toString()}`)
      ).data;
    },
    staleTime: 1000 * 5,
  });
};
