import { useEffect, useState } from 'react';

import { bridgeSDK } from '@/core/constants/bridgeSDK';

export const useFetchCBridgeTransferWaitingTime = ({
  srcChainId,
  dstChainId,
}: {
  srcChainId: number;
  dstChainId: number;
}) => {
  const [time, setTime] = useState<number | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const estimatedTime = await bridgeSDK.cBridge.getEstimatedWaitingTime({
          srcChainId,
          dstChainId,
        });

        setTime(estimatedTime.median_transfer_latency_in_second);
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log('error', error);
      }
    })();
  }, [srcChainId, dstChainId]);
  return { time };
};
