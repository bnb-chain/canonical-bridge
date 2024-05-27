import { useQuery } from '@tanstack/react-query';
import { getDeBridgeTxQuote } from '@/bridges/debridge/api';

export const useCreateOrderTx = (params: {
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
  dstChainTokenOutRecipient?: string;
  srcChainOrderAuthorityAddress?: string; //an address a user has access to
  referralCode?: number;
  senderAddress?: string;
  affiliateFeePercent?: number;
  affiliateFeeRecipient?: string;
  prependOperatingExpenses?: boolean;
  srcChainTokenInSenderPermit?: string;
  dstChainOrderAuthorityAddress?: string; //an address a user has access to
}) => {
  const urlParams = new URLSearchParams(params as any);
  [...urlParams.entries()].forEach(([key, value]) => {
    if (!value || value === 'undefined') {
      urlParams.delete(key);
    }
  });
  return useQuery<any>({
    queryKey: [
      'debridge-create-tx',
      params.srcChainId,
      params.srcChainTokenIn,
      params.srcChainTokenInAmount,
      params.dstChainId,
      params.dstChainTokenOut,
    ],
    queryFn: async () => {
      return getDeBridgeTxQuote(urlParams);
    },
  });
};
