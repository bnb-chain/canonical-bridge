'use client';
import { ERC20_TOKEN } from '@/contract/abi';
import { useAccount } from '@bridge/wallet';
import { useContractRead } from 'wagmi';

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
  } = useContractRead({
    abi: ERC20_TOKEN,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
  });
  return {
    balance,
    isError,
    error,
  };
};
