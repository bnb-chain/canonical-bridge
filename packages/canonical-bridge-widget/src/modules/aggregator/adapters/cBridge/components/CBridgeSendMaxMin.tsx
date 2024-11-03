import { memo, useEffect } from 'react';

import { useCBridgeSendMaxMin } from '@/modules/aggregator/adapters/cBridge/hooks/useCBridgeSendMaxMin';
import { useAppDispatch } from '@/modules/store/StoreProvider';
import { setCBridgeMaxMinSendAmt } from '@/modules/aggregator/action';

interface CBridgeSendMaxMinProps {}

export const CBridgeSendMaxMin = memo<CBridgeSendMaxMinProps>(function CBridgeSendMaxMin() {
  const { minMaxSendAmt: cBridgeAllowedAmt } = useCBridgeSendMaxMin();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCBridgeMaxMinSendAmt(cBridgeAllowedAmt));
  }, [cBridgeAllowedAmt.max, cBridgeAllowedAmt.min, dispatch]);

  return null;
});
