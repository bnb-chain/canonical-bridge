'use client';
import { ERC20_TOKEN } from '@/contract/abi';
import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { config } from '@/app/html';
import { readContract } from 'wagmi/actions';

export const useGetTokenBalance = () => {
  const { address } = useAccount();
  const getTokenBalance = useCallback(
    async (tokenAddress: `0x${string}`) => {
      if (!address || !tokenAddress) return;
      try {
        const balance = await readContract(config, {
          address: tokenAddress,
          abi: ERC20_TOKEN,
          functionName: 'balanceOf',
          args: [address as `0x${string}`],
        });
        return balance;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    },
    [address]
  );

  return {
    getTokenBalance,
  };
};
