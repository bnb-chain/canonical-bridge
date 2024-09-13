import { Box, useColorMode, useTheme } from '@bnb-chain/space';
import { useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { useInputValidation } from '@/modules/transfer/hooks/useInputValidation';
import { useDebounce } from '@/core/hooks/useDebounce';
import { DEBOUNCE_DELAY } from '@/core/constants';
import { useLoadingTokenBalance } from '@/modules/transfer/hooks/useLoadingTokenBalance';
import { useCBridgeSendMaxMin } from '@/modules/bridges/cbridge/hooks';
import { setError, setIsTransferable } from '@/modules/transfer/action';

export const InputValidationMessage = () => {
  const { colorMode } = useColorMode();
  const { validateInput } = useInputValidation();
  const { chain, address } = useAccount();
  const dispatch = useAppDispatch();

  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const theme = useTheme();
  const error = useAppSelector((state) => state.transfer.error);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);

  const debouncedSendValue = useDebounce(sendValue, DEBOUNCE_DELAY);
  const { balance } = useLoadingTokenBalance();
  const { data: nativeBalance } = useBalance({ address: address as `0x${string}` });
  const { minMaxSendAmt } = useCBridgeSendMaxMin();

  useEffect(() => {
    const balanceResult = validateInput({
      balance,
      decimal: selectedToken?.decimal || 0,
      minMaxSendAmt,
      value: Number(debouncedSendValue),
      isConnected: !!chain,
      bridgeType: transferActionInfo?.bridgeType,
      isPegged: selectedToken?.isPegged,
      estimatedAmount: estimatedAmount,
      nativeBalance,
    });
    if (balanceResult?.isError === true) {
      dispatch(setIsTransferable(false));
      dispatch(setError(balanceResult.text));
    } else {
      dispatch(setError(undefined));
      dispatch(setIsTransferable(true));
    }
  }, [
    balance,
    chain,
    debouncedSendValue,
    dispatch,
    estimatedAmount,
    minMaxSendAmt,
    nativeBalance,
    selectedToken?.decimal,
    selectedToken?.isPegged,
    transferActionInfo,
    validateInput,
  ]);

  return error ? (
    <Box
      color={theme.colors[colorMode].text.danger}
      fontSize={'12px'}
      fontWeight={400}
      lineHeight={'16px'}
      position={'absolute'}
      top={`calc(100% + ${'8px'})`}
    >
      {error}
    </Box>
  ) : null;
};
