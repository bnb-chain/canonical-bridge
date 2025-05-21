import { useEffect, useMemo, useState } from 'react';

import { useBridgeConfig } from '@/index';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setRefreshAnimationProgress } from '@/modules/transfer/action';

export const useFeeRefreshProgress = () => {
  const bridgeConfig = useBridgeConfig();
  const dispatch = useAppDispatch();
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const [localProgress, setLocalProgress] = useState(0); // Local state for animation
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

      setLocalProgress(newProgress); // Update local state

      // Optionally dispatch to global state only when animation completes
      if (newProgress >= 1) {
        dispatch(setRefreshAnimationProgress(newProgress));
        startTime = timestamp; // Reset for continuous looping
      }

      if (newProgress < 1 || !isGlobalFeeLoading) {
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

  return localProgress; // Return local progress for rendering
};
