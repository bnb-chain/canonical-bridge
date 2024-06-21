'use client';

import { useAccount, useNetwork } from 'wagmi';
import { ERC20_TOKEN } from '@/contract/abi';
import { useContractRead } from 'wagmi';
import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { parseUnits } from 'viem';
import { useGetTokenBalance } from '@/contract/hooks/useGetTokenBalance';

export const useGetAllowance = ({
  tokenAddress,
  sender,
}: {
  tokenAddress: `0x${string}`;
  sender: `0x${string}`;
}) => {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);

  const [allowance, setAllowance] = useState<bigint | null>(null);

  const { balance } = useGetTokenBalance({
    tokenAddress: selectedToken?.address as `0x${string}`,
  });

  const {
    data: initAllowance,
    isLoading,
    isError,
    error,
    refetch,
  } = useContractRead({
    abi: ERC20_TOKEN,
    address: tokenAddress,
    functionName: 'allowance',
    args: [address as `0x${string}`, sender],
    staleTime: 5000,
  });
  useEffect(() => {
    if (typeof initAllowance === 'bigint') {
      setAllowance(initAllowance);
    }
  }, [initAllowance]);
  useEffect(() => {
    let mount = true;
    if (!mount) return;
    try {
      const inter = setInterval(async () => {
        const { data: allowance } = await refetch({
          cancelRefetch:
            !address ||
            !selectedToken ||
            chain?.id !== fromChain?.id ||
            !initAllowance ||
            !sender ||
            !balance,
        });
        if (typeof allowance === 'bigint' && allowance) {
          setAllowance(allowance);
        }
      }, 10000);
      return () => {
        mount = false;
        inter && clearInterval(inter);
      };
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }, [
    refetch,
    address,
    balance,
    selectedToken,
    fromChain,
    chain,
    initAllowance,
    sender,
  ]);
  const isAllowanceLow = useMemo(() => {
    if (!sendValue || !selectedToken || !allowance) {
      return true;
    }
    try {
      const sendVal = parseUnits(sendValue, selectedToken.decimal);
      if (sendVal <= allowance) {
        return false;
      } else {
        return true;
      }
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log(e);
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
