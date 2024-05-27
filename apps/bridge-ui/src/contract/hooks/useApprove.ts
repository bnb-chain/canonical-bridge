'use client';

import { useAccount, useWalletClient } from 'wagmi';
import { useCallback, useState } from 'react';
import { ERC20_TOKEN } from '@/contract/abi';
import { readContract } from 'wagmi/actions';
import { config } from '@/app/html';

export const useApprove = () => {
  const { address } = useAccount();
  const [isLoadingAllowance, setIsLoadingAllowance] = useState(false);
  const [isLoadingApprove, setIsLoadingApprove] = useState(false);
  const { data: walletClient } = useWalletClient();

  const getAllowance = useCallback(
    async (tokenAddress: `0x${string}`, sender: `0x${string}`) => {
      if (!address) return;
      setIsLoadingAllowance(true);
      try {
        const allowance = await readContract(config, {
          address: tokenAddress,
          abi: ERC20_TOKEN,
          functionName: 'allowance',
          args: [address as `0x${string}`, sender],
        });
        setIsLoadingAllowance(false);
        return allowance;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    },
    [address]
  );

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
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    },
    [walletClient, address]
  );
  return {
    getAllowance,
    approveErc20Token,
    isLoadingApprove,
    isLoadingAllowance,
  };
};
