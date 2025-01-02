import { useCallback } from 'react';

import { reportEvent } from '@/core/utils/gtm';
import { useAppSelector } from '@/modules/store/StoreProvider';

export const useHandleTxFailure = ({ onOpenFailedModal }: { onOpenFailedModal: () => void }) => {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);

  const handleFailure = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      reportEvent({
        id: 'transaction_bridge_fail',
        params: {
          item_category: fromChain?.name,
          item_category2: toChain?.name,
          token: selectedToken?.displaySymbol,
          value: sendValue,
          item_variant: transferActionInfo?.bridgeType,
          message: JSON.stringify(e.message || e),
          page_location: JSON.stringify(e.message || e),
        },
      });
      onOpenFailedModal();
    },
    [
      fromChain?.name,
      onOpenFailedModal,
      selectedToken?.displaySymbol,
      sendValue,
      toChain?.name,
      transferActionInfo?.bridgeType,
    ],
  );

  return { handleFailure };
};
