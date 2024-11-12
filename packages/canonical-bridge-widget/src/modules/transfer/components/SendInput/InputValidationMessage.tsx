import { Box, useColorMode, useTheme } from '@bnb-chain/space';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { useInputValidation } from '@/modules/transfer/hooks/useInputValidation';
import { setError, setIsTransferable } from '@/modules/transfer/action';
import { useTokenBalance } from '@/modules/aggregator/hooks/useTokenBalance';

export const InputValidationMessage = () => {
  const { colorMode } = useColorMode();
  const { validateInput } = useInputValidation();
  const { chain } = useAccount();
  const dispatch = useAppDispatch();

  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const theme = useTheme();
  const error = useAppSelector((state) => state.transfer.error);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const minMaxSendAmt = useAppSelector((state) => state.aggregator.bridgeMaxMin.cBridge);

  const { getTokenBalance } = useTokenBalance();

  const [balanceInputError, setBalanceInputError] = useState<string>('');

  useEffect(() => {
    const balance = getTokenBalance({
      symbol: selectedToken?.displaySymbol,
    });

    const balanceResult = validateInput({
      balance: balance ? Number(balance) : undefined,
      decimal: selectedToken?.decimals || 0,
      value: Number(sendValue),
      // isConnected: !!chain,
      bridgeType: transferActionInfo?.bridgeType,
      estimatedAmount: estimatedAmount,
    });
    if (balanceResult?.isError === true) {
      dispatch(setIsTransferable(false));
      dispatch(setError({ text: balanceResult.text }));
      setBalanceInputError(balanceResult.text);
    } else {
      setBalanceInputError('');
      dispatch(setError({ text: '' }));
      dispatch(setIsTransferable(true));
    }
  }, [
    chain,
    sendValue,
    dispatch,
    estimatedAmount,
    minMaxSendAmt?.min,
    minMaxSendAmt?.max,
    selectedToken?.decimals,
    selectedToken?.isPegged,
    transferActionInfo,
    validateInput,
    getTokenBalance,
    selectedToken?.displaySymbol,
  ]);

  const errorMsg = balanceInputError ?? error?.text;

  return errorMsg ? (
    <Box
      color={theme.colors[colorMode].text.danger}
      fontSize={'14px'}
      fontWeight={400}
      lineHeight={'16px'}
      mt={'8px'}
    >
      {errorMsg}
    </Box>
  ) : null;
};
