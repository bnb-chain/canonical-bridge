import { useQuery } from '@tanstack/react-query';
import { CBridgeTransferEstimatedTime } from '@bnb-chain/canonical-bridge-sdk';

import { bridgeSDK } from '@/core/constants/bridgeSDK';

export const useCBridgeTransferWaitingTime = ({
  srcChainId,
  dstChainId,
  isEnabled = false,
}: {
  srcChainId?: number;
  dstChainId?: number;
  isEnabled?: boolean;
}) => {
  return useQuery<CBridgeTransferEstimatedTime>({
    queryKey: ['cbridge-transfer-waiting-time', srcChainId, dstChainId],
    queryFn: async () => {
      return await bridgeSDK.cBridge.getEstimatedWaitingTime({
        srcChainId: srcChainId!,
        dstChainId: dstChainId!,
      });
    },
    enabled: !!srcChainId && !!dstChainId && isEnabled,
  });
};
