import { useCallback } from 'react';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { EventTypes, useAnalytics } from '@/core/analytics';
import { useTokenPrice } from '@/modules/aggregator/providers/TokenPricesProvider';

export const useHandleTxFailure = ({ onOpenFailedModal }: { onOpenFailedModal: () => void }) => {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const selectedToToken = useAppSelector((state) => state.transfer.toToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const { emit } = useAnalytics();
  const { getTokenPrice } = useTokenPrice();

  const tokenPrice = getTokenPrice({
    chainId: fromChain?.id,
    chainType: fromChain?.chainType,
    tokenAddress: selectedToken?.address,
    tokenSymbol: selectedToken?.symbol,
  });

  const handleFailure = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      emit(EventTypes.TRANSACTION_BRIDGE_FAIL, {
        tokenAddress: selectedToken?.address || '',
        usdRate: String(tokenPrice || ''),
        toToken: selectedToToken?.displaySymbol || '',
        toTokenAddress: selectedToToken?.address || '',
        bridgeRoute: transferActionInfo?.bridgeType || '',
        fromNetwork: fromChain?.name || '',
        toNetwork: toChain?.name || '',
        item_category: fromChain?.name || '',
        item_category2: toChain?.name || '',
        token: selectedToken?.displaySymbol || '',
        value: sendValue,
        item_variant: transferActionInfo?.bridgeType || '',
        message: JSON.stringify(e.message || e),
        page_location: JSON.stringify(e.message || e),
      });
      onOpenFailedModal();
    },
    [
      emit,
      selectedToken?.address,
      selectedToken?.displaySymbol,
      tokenPrice,
      selectedToToken?.displaySymbol,
      selectedToToken?.address,
      transferActionInfo?.bridgeType,
      fromChain?.name,
      toChain?.name,
      sendValue,
      onOpenFailedModal,
    ],
  );

  return { handleFailure };
};
