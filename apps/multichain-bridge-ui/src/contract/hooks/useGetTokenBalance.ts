'use client';
import { ERC20_TOKEN } from '@/contract/abi';
import { useAccount } from '@bridge/wallet';
import { useContractRead, useNetwork } from 'wagmi';

export const useGetTokenBalance = ({
  tokenAddress,
}: {
  tokenAddress: `0x${string}`;
}) => {
  const { address } = useAccount();
  const {
    data: balance,
    isError,
    error,
    refetch,
  } = useContractRead({
    abi: ERC20_TOKEN,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    cacheTime: 5000,
  });
  return {
    balance,
    isError,
    error,
    refetch,
  };
};
