import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { useGetTokenBalance } from '@/core/contract/hooks/useGetTokenBalance';
import { useAppSelector } from '@/modules/store/StoreProvider';

export const useLoadingTokenBalance = () => {
  const [balance, setBalance] = useState<bigint | null>(null);
  const { address, chain } = useAccount();

  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const { balance: initBalance, refetch } = useGetTokenBalance({
    tokenAddress: selectedToken?.address as `0x${string}`,
  });

  useEffect(() => {
    if (typeof initBalance === 'bigint') {
      setBalance(initBalance);
    } else if (!selectedToken) {
      setBalance(0n);
    } else {
      setBalance(0n);
    }
  }, [initBalance, selectedToken]);

  useEffect(() => {
    let mount = true;
    if (!mount) return;
    try {
      const inter = setInterval(async () => {
        if (!address || !selectedToken || chain?.id !== fromChain?.id) {
          return;
        }
        refetch({
          cancelRefetch: !address || !selectedToken || chain?.id !== fromChain?.id,
        })
          .then(({ data: balance }) => {
            if (typeof balance === 'bigint') {
              setBalance(balance);
            }
          })
          .catch(() => {});
      }, 10000);
      return () => {
        mount = false;
        inter && clearInterval(inter);
      };
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }, [refetch, address, selectedToken, fromChain, chain, initBalance]);

  return { balance };
};
