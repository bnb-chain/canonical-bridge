'use client';

import { useAccount } from 'wagmi';
import { ERC20_TOKEN } from '@/contract/abi';
import { useContractRead } from 'wagmi';
import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { parseUnits } from 'viem';

export const useGetAllowance = ({
  tokenAddress,
  sender,
}: {
  tokenAddress: `0x${string}`;
  sender: `0x${string}`;
}) => {
  const { address } = useAccount();
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
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
    cacheTime: 5000,
  });
  const isAllowanceLow = useMemo(() => {
    if (!sendValue || !selectedToken || !allowance) {
      return true;
    }
    const sendVal = parseUnits(sendValue, selectedToken.decimal);
    console.log(sendVal, allowance);
    if (sendVal <= allowance) {
      return false;
    } else {
      return true;
    }
  }, [selectedToken, sendValue, allowance]);
  return {
    allowance,
    isAllowanceLow,
    isLoading,
    isError,
    error,
  };
};
