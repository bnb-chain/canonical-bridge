import { formatUnits } from 'viem';

import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import { useSolanaTokenBalance } from '@/modules/wallet/hooks/useSolanaTokenBalance';
import { setError, setIsTransferable, setSendValue } from '@/modules/transfer/action';
import { useSolanaBalance } from '@/modules/wallet/hooks/useSolanaBalance';
import { useSolanaAccount } from '@/modules/wallet/hooks/useSolanaAccount';
import {
  getBalanceComponent,
  StyledTokenBalance,
} from '@/modules/transfer/components/TokenBalance';

export const SolanaTokenBalance = () => {
  const dispatch = useAppDispatch();

  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const error = useAppSelector((state) => state.transfer.error);

  const { address, isConnected } = useSolanaAccount();
  const { data: nativeBalance } = useSolanaBalance(address);
  const { data: tokenBalance } = useSolanaTokenBalance(selectedToken?.rawData?.deBridge?.address);

  const setMaxAmount = () => {
    if (tokenBalance && selectedToken) {
      dispatch(setSendValue(formatUnits(tokenBalance, selectedToken?.decimal || 0)));
    }
  };

  const balanceResult = getBalanceComponent({
    balance: tokenBalance || 0n,
    decimal: selectedToken?.decimal || 0,
    minMaxSendAmt: { max: 1n, min: 1n },
    value: Number(sendValue),
    isConnected,
    transferActionInfo,
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

  return tokenBalance !== undefined && selectedToken ? (
    <StyledTokenBalance
      error={error}
      balance={tokenBalance}
      selectedToken={selectedToken}
      setMaxAmount={setMaxAmount}
    />
  ) : null;
};
