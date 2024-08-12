import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { parseUnits } from 'viem';

import { createDeBridgeTxQuote } from '@/modules/bridges/debridge/api';
import { setEstimatedAmount, setReceiveValue } from '@/modules/transfer/action';
import { useDebounce } from '@/core/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { DEBOUNCE_DELAY } from '@/core/constants';

export const useGetDebridgeEstimateAmount = () => {
  const { address } = useAccount();
  const dispatch = useAppDispatch();
  const { toTokenInfo } = useToTokenInfo();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  const debouncedSendValue = useDebounce(sendValue, DEBOUNCE_DELAY);

  const getDeBridgeEstimate = useCallback(async () => {
    if (
      !fromChain ||
      !toChain ||
      !selectedToken ||
      !debouncedSendValue ||
      !Number(debouncedSendValue)
    ) {
      dispatch(
        setReceiveValue({
          deBridge: undefined,
        }),
      );
      dispatch(setEstimatedAmount({ deBridge: undefined }));
      return null;
    }
    try {
      const deBridgeParams = {
        srcChainId: fromChain.id,
        srcChainTokenIn: selectedToken?.address as `0x${string}`,
        srcChainTokenInAmount: parseUnits(debouncedSendValue, selectedToken.decimal),
        dstChainId: toChain.id,
        dstChainTokenOut: toTokenInfo?.rawData.deBridge?.address,
        prependOperatingExpenses: false,
        affiliateFeePercent: 0,
      } as any;
      if (address) {
        deBridgeParams.dstChainTokenOutRecipient = address;
        deBridgeParams.dstChainOrderAuthorityAddress = address;
        deBridgeParams.srcChainOrderAuthorityAddress = address;
      }
      const urlParams = new URLSearchParams(deBridgeParams as any);
      const deBridgeQuote = await createDeBridgeTxQuote(urlParams);

      // console.log('deBridgeQuote', deBridgeQuote);
      dispatch(setEstimatedAmount({ deBridge: deBridgeQuote }));
      if (Number(deBridgeQuote?.estimation.dstChainTokenOut.amount) > 0) {
        dispatch(
          setReceiveValue({
            deBridge: deBridgeQuote?.estimation.dstChainTokenOut.amount,
          }),
        );
      } else {
        dispatch(
          setReceiveValue({
            deBridge: undefined,
          }),
        );
      }
      return deBridgeQuote;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error, error.message);
      dispatch(
        setReceiveValue({
          deBridge: undefined,
        }),
      );
      dispatch(setEstimatedAmount({ deBridge: undefined }));
      return null;
    }
  }, [fromChain, toChain, selectedToken, debouncedSendValue, toTokenInfo, address, dispatch]);

  return { getDeBridgeEstimate };
};
