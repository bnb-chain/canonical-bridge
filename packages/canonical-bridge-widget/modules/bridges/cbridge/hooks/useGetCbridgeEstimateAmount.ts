import { useCallback, useMemo } from 'react';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';

import { getCBridgeEstimateAmount } from '@/modules/bridges/cbridge/api/getCBridgeEstimateAmount';
import { setEstimatedAmount } from '@/modules/transfer/action';
import { useDebounce } from '@/core/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import { DEBOUNCE_DELAY } from '@/core/constants';

export const useGetCbridgeEstimateAmount = () => {
  const { address } = useAccount();
  const dispatch = useAppDispatch();

  const slippage = useAppSelector((state) => state.transfer.slippage);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  const debouncedSendValue = useDebounce(sendValue, DEBOUNCE_DELAY);
  const isPegged = useMemo(() => selectedToken?.isPegged || false, [selectedToken]);

  const getCBridgeEstimated = useCallback(async () => {
    if (
      !fromChain ||
      !toChain ||
      !selectedToken ||
      !debouncedSendValue ||
      !Number(debouncedSendValue)
    ) {
      dispatch(setEstimatedAmount({ cBridge: undefined }));
      return;
    }

    const cBridgeParams = {
      src_chain_id: fromChain?.id,
      dst_chain_id: toChain?.id,
      token_symbol: selectedToken?.symbol,
      amt: String(parseUnits(debouncedSendValue, selectedToken?.decimal)),
      usr_addr: address,
      slippage_tolerance: slippage,
      is_pegged: isPegged,
    };

    try {
      const cBridgeEstimated = await getCBridgeEstimateAmount(cBridgeParams);
      // console.log('cBridgeEstimated', cBridgeEstimated);
      dispatch(setEstimatedAmount({ cBridge: cBridgeEstimated }));
      return cBridgeEstimated;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error, error.message);
      dispatch(setEstimatedAmount({ cBridge: undefined }));
      return null;
    }
  }, [
    selectedToken,
    fromChain,
    toChain,
    dispatch,
    debouncedSendValue,
    address,
    isPegged,
    slippage,
  ]);
  return { getCBridgeEstimated };
};
