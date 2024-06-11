'use client';

import { useAccount } from 'wagmi';
import { ERC20_TOKEN } from '@/contract/abi';
import { useContractRead } from 'wagmi';

export const useGetAllowance = ({
  tokenAddress,
  sender,
}: {
  tokenAddress: `0x${string}`;
  sender: `0x${string}`;
}) => {
  const { address } = useAccount();
  const {
    data: allowance,
    isLoading,
    isError,
    error,
  } = useContractRead({
    abi: ERC20_TOKEN,
    address: tokenAddress,
    functionName: 'allowance',
    args: [address as `0x${string}`, sender],
  });
  return {
    allowance,
    isLoading,
    isError,
    error,
  };
};
