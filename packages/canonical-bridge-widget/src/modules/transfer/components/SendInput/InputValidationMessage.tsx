import { Box, useColorMode, useTheme } from '@bnb-chain/space';
import { useEffect, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { useInputValidation } from '@/modules/transfer/hooks/useInputValidation';
import { useDebounce } from '@/core/hooks/useDebounce';
import { DEBOUNCE_DELAY } from '@/core/constants';
import { useLoadingTokenBalance } from '@/modules/transfer/hooks/useLoadingTokenBalance';
import { setIsTransferable } from '@/modules/transfer/action';
import { useCBridgeSendMaxMin } from '@/modules/aggregator/adapters/cBridge/hooks/useCBridgeSendMaxMin';

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

  const [balanceInputError, setBalanceInputError] = useState<string>('');

  useEffect(() => {
    const balanceResult = validateInput({
      balance,
      decimal: selectedToken?.decimals || 0,
      value: Number(debouncedSendValue),
      // isConnected: !!chain,
      bridgeType: transferActionInfo?.bridgeType,
      estimatedAmount: estimatedAmount,
      nativeBalance,
    });
    if (balanceResult?.isError === true) {
      dispatch(setIsTransferable(false));
      setBalanceInputError(balanceResult.text);
    } else {
      setBalanceInputError('');
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
    selectedToken?.decimals,
    selectedToken?.isPegged,
    transferActionInfo,
    validateInput,
  ]);

  return error || balanceInputError ? (
    <Box
      color={theme.colors[colorMode].text.danger}
      fontSize={'12px'}
      fontWeight={400}
      lineHeight={'16px'}
      position={'absolute'}
      top={`calc(100% + ${'8px'})`}
    >
      {error?.text ?? balanceInputError}
    </Box>
  ) : null;
};
