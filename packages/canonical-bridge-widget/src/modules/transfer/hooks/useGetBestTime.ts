import { useEffect, useState } from 'react';

import { useCBridgeTransferWaitingTime } from '@/modules/aggregator/adapters/cBridge/hooks/useCBridgeTransferWaitingTime';
import { useStargateWaitTime } from '@/modules/aggregator/adapters/stargate/hooks/useStargateWaitTime';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { getMinValueKey } from '@/core/utils/number';

export const useGetBestTime = () => {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);

  const [bestTimeRoute, setBestTimeRoute] = useState<string>('');

  const { data: stargateEstimatedTime } = useStargateWaitTime();
  const { data: cBridgeWaitTime } = useCBridgeTransferWaitingTime({
    srcChainId: fromChain?.id,
    dstChainId: toChain?.id,
    isEnabled: true,
  });

  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bestTime: any = {};
      if (estimatedAmount?.['deBridge']?.order?.approximateFulfillmentDelay) {
        bestTime.deBridge = estimatedAmount?.['deBridge']?.order?.approximateFulfillmentDelay;
      }
      if (stargateEstimatedTime?.avgWaitTime) {
        bestTime.stargate = stargateEstimatedTime?.avgWaitTime / 1000;
      }
      if (cBridgeWaitTime?.median_transfer_latency_in_second) {
        bestTime.cBridge = Number(cBridgeWaitTime?.median_transfer_latency_in_second);
      }
      const bestTimer = getMinValueKey(bestTime);
      setBestTimeRoute(bestTimer);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Error in useGetBestTime: ', error);
    }
  }, [
    stargateEstimatedTime?.avgWaitTime,
    estimatedAmount,
    cBridgeWaitTime?.median_transfer_latency_in_second,
  ]);

  return bestTimeRoute;
};
