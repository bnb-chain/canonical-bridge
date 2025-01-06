import { useEffect, useMemo } from 'react';

import { useBridgeConfig } from '@/index';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setRefreshAnimationProgress } from '@/modules/transfer/action';

export const useFeeRefreshProgress = () => {
  const bridgeConfig = useBridgeConfig();
  const dispatch = useAppDispatch();
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const duration = useMemo(() => {
    return bridgeConfig.http?.refetchingInterval ?? 30000;
  }, [bridgeConfig.http?.refetchingInterval]);

  useEffect(() => {
    if (!transferActionInfo || isGlobalFeeLoading) return;
    let startTime: number;
    let animationFrame: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const newProgress = Math.min(elapsed / duration, 1);

      dispatch(setRefreshAnimationProgress(newProgress));
      if (newProgress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        startTime = timestamp;
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [duration, dispatch, isGlobalFeeLoading, transferActionInfo]);
  return null;
};
