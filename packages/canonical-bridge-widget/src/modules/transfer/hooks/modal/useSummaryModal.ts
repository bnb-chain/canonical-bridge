import { useCallback } from 'react';

import { useAppDispatch } from '@/modules/store/StoreProvider';
import { setIsSummaryModalOpen } from '@/modules/transfer/action';

export const useSummaryModal = () => {
  const dispatch = useAppDispatch();

  const onOpenSummaryModal = useCallback(() => {
    dispatch(setIsSummaryModalOpen(true));
  }, [dispatch]);

  const onCloseSummaryModal = useCallback(() => {
    dispatch(setIsSummaryModalOpen(false));
  }, [dispatch]);
  return {
    onOpenSummaryModal,
    onCloseSummaryModal,
  };
};
