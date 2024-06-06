'use client';

import { useWalletClient } from 'wagmi';
import { useAccount } from '@bridge/wallet';
import { useCallback, useState } from 'react';
import { ERC20_TOKEN } from '@/contract/abi';

export const useApprove = () => {
  const { address } = useAccount();
  const [isLoadingApprove, setIsLoadingApprove] = useState(false);
  const { data: walletClient } = useWalletClient();

  const approveErc20Token = useCallback(
    async (tokenAddress: string, spender: `0x${string}`, amount: BigInt) => {
      if (!address || !walletClient || !amount || !spender) return;

      try {
        setIsLoadingApprove(true);
        const hash = await walletClient?.writeContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_TOKEN,
          functionName: 'approve',
          args: [spender, amount as bigint],
        });
        setIsLoadingApprove(false);
        return hash;
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.log(e, e.message);
      }
    },
    [walletClient, address]
  );
  return {
    approveErc20Token,
    isLoadingApprove,
  };
};
