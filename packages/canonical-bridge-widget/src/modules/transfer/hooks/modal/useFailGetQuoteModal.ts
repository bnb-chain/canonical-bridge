import { useCallback } from 'react';

import { useAppDispatch } from '@/modules/store/StoreProvider';
import { setIsFailedGetQuoteModalOpen } from '@/modules/transfer/action';

export const useFailGetQuoteModal = () => {
  const dispatch = useAppDispatch();

  const onOpenFailedGetQuoteModal = useCallback(() => {
    dispatch(setIsFailedGetQuoteModalOpen(true));
  }, [dispatch]);

  const onCloseFailedGetQuoteModal = useCallback(() => {
    dispatch(setIsFailedGetQuoteModalOpen(false));
  }, [dispatch]);
  return {
    onOpenFailedGetQuoteModal,
    onCloseFailedGetQuoteModal,
  };
};
