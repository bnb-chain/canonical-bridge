import { useMemo } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import { useBytecode } from 'wagmi';

import { isEvmAddress, isSolanaAddress } from '@/core/utils/address';
import { useAppSelector } from '@/modules/store/StoreProvider';

export function useSolanaTransferInfo() {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const toAccount = useAppSelector((state) => state.transfer.toAccount);

  const { connection } = useConnection();

  const { data: evmBytecode } = useBytecode({
    address: toAccount.address as `0x${string}`,
    chainId: toChain?.id,
  });

  const info = useMemo(() => {
    const fromChainIsSolana = fromChain?.chainType == 'solana' && toChain;
    const toChainIsSolana = toChain?.chainType === 'solana' && fromChain;
    const isSolanaTransfer = fromChainIsSolana || toChainIsSolana;

    const isAvailableInput =
      (fromChainIsSolana && isEvmAddress(toAccount.address)) ||
      (toChainIsSolana && isSolanaAddress(toAccount.address));

    return {
      fromChainIsSolana,
      toChainIsSolana,
      isSolanaTransfer,
      isAvailableInput,
    };
  }, [fromChain, toAccount.address, toChain]);

  const { data: isSolanaProgram = false } = useQuery<boolean>({
    queryKey: ['useIsSolanaProgram', toAccount.address],
    enabled: info.toChainIsSolana && info.isAvailableInput,
    queryFn: async () => {
      if (!toAccount.address) return false;
      const result = await connection.getAccountInfo(new PublicKey(toAccount.address));
      return !!result && result.executable;
    },
  });

  return {
    isSolanaTransfer: info.isSolanaTransfer,
    isSolanaProgram,
    isSolanaAvailableToAccount:
      info.isAvailableInput &&
      ((info.fromChainIsSolana && !evmBytecode) || (info.toChainIsSolana && !isSolanaProgram)),
  };
}
