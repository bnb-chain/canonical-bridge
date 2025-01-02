import React from 'react';

import { MIN_SOL_TO_ENABLED_TX } from '@/core/constants';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { useSolanaBalance } from '@/modules/wallet/hooks/useSolanaBalance';
import { WarningMessage } from '@/modules/transfer/components/TransferWarningMessage/WarningMessage';

interface ITransferWarningMessageProps {
  text: React.ReactNode;
}

export const TransferWarningMessage = ({ text, ...restProps }: ITransferWarningMessageProps) => {
  const { data } = useSolanaBalance();
  const solBalance = Number(data?.formatted);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  if (fromChain?.chainType === 'solana' && solBalance < MIN_SOL_TO_ENABLED_TX) {
    return <WarningMessage text={text} {...restProps} />;
  }
  return null;
};
