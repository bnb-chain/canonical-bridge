import { useQuery } from '@tanstack/react-query';
import { CBridgeTransferEstimatedTime } from '@bnb-chain/canonical-bridge-sdk';

import { useBridgeSDK } from '@/core/hooks/useBridgeSDK';

export const useCBridgeTransferWaitingTime = ({
  srcChainId,
  dstChainId,
  isEnabled = false,
}: {
  srcChainId?: number;
  dstChainId?: number;
  isEnabled?: boolean;
}) => {
  const bridgeSDK = useBridgeSDK();
  return useQuery<CBridgeTransferEstimatedTime>({
    queryKey: ['cbridge-transfer-waiting-time', srcChainId, dstChainId],
    queryFn: async () => {
      return await bridgeSDK.cBridge.getEstimatedWaitingTime({
        srcChainId: srcChainId!,
        dstChainId: dstChainId!,
      });
    },
    enabled: !!srcChainId && !!dstChainId && isEnabled && !!bridgeSDK?.cBridge,
  });
};
