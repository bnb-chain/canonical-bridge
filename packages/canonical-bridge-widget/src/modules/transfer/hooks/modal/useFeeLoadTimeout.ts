import { useCallback } from 'react';

import { useAppDispatch } from '@/modules/store/StoreProvider';
import { setIsFeeTimeoutModalOpen } from '@/modules/transfer/action';
import { setSendValue } from '@/modules/transfer/action';

export const useFeeLoadTimeout = () => {
  const dispatch = useAppDispatch();

  const onOpenFeeTimeoutModal = useCallback(() => {
    dispatch(setIsFeeTimeoutModalOpen(true));
  }, [dispatch]);

  const onCloseFeeTimeoutModal = useCallback(() => {
    dispatch(setIsFeeTimeoutModalOpen(false));
    dispatch(setSendValue(''));
  }, [dispatch]);
  return {
    onOpenFeeTimeoutModal,
    onCloseFeeTimeoutModal,
  };
};
