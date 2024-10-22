import { Box, useBreakpointValue, useColorMode, useTheme } from '@bnb-chain/space';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { useInputValidation } from '@/modules/transfer/hooks/useInputValidation';
import { setError, setIsTransferable } from '@/modules/transfer/action';
import { useCBridgeSendMaxMin } from '@/modules/aggregator/adapters/cBridge/hooks/useCBridgeSendMaxMin';
import { useTokenBalance } from '@/modules/aggregator/hooks/useTokenBalance';

export const InputValidationMessage = () => {
  const { colorMode } = useColorMode();
  const { validateInput } = useInputValidation();
  const { chain } = useAccount();
  const dispatch = useAppDispatch();
  const isBase = useBreakpointValue({ base: true, lg: false }) ?? false;

  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const theme = useTheme();
  const error = useAppSelector((state) => state.transfer.error);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);

  const { getTokenBalance } = useTokenBalance();

  const { minMaxSendAmt } = useCBridgeSendMaxMin();

  const [balanceInputError, setBalanceInputError] = useState<string>('');

  useEffect(() => {
    const balance = getTokenBalance({
      symbol: selectedToken?.displaySymbol,
    });

    const balanceResult = validateInput({
      balance,
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
    minMaxSendAmt,
    selectedToken?.decimals,
    selectedToken?.isPegged,
    transferActionInfo,
    validateInput,
    getTokenBalance,
    selectedToken?.displaySymbol,
  ]);

  return error || balanceInputError ? (
    <Box
      color={theme.colors[colorMode].text.danger}
      fontSize={'12px'}
      fontWeight={400}
      lineHeight={'16px'}
      position={isBase ? 'static' : 'absolute'}
      top={`calc(100% + ${'8px'})`}
    >
      {balanceInputError ?? error?.text}
    </Box>
  ) : null;
};
