import { useAccount, useReadContract } from 'wagmi';
import { useEffect, useMemo, useState } from 'react';
import { parseUnits } from 'viem';

import { useGetTokenBalance } from '@/core/contract/hooks/useGetTokenBalance';
import { ERC20_TOKEN } from '@/core/contract/abi';
import { useAppSelector } from '@/core/store/hooks';

export const useGetAllowance = ({
  tokenAddress,
  sender,
}: {
  tokenAddress: `0x${string}`;
  sender: `0x${string}`;
}) => {
  const { address, chain } = useAccount();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const toTokenInfo = useAppSelector((state) => state.transfer.toToken);

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
  } = useReadContract({
    abi: ERC20_TOKEN,
    address: tokenAddress,
    functionName: 'allowance',
    args: [address as `0x${string}`, sender],
    query: {
      staleTime: 8000,
      enabled:
        !!address &&
        !!selectedToken &&
        !!fromChain &&
        !!chain &&
        !!tokenAddress &&
        !!sendValue &&
        !!toTokenInfo,
    },
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
      if (
        !address ||
        !selectedToken ||
        chain?.id !== fromChain?.id ||
        initAllowance === null ||
        !sender ||
        !balance
      ) {
        return;
      }
      const inter = setInterval(async () => {
        refetch({
          cancelRefetch: !address || !selectedToken || chain?.id !== fromChain?.id,
        })
          .then(({ data: allowance }) => {
            if (typeof allowance === 'bigint' && allowance) {
              setAllowance(allowance);
            }
          })
          .catch(() => {});
      }, 8000);
      return () => {
        mount = false;
        inter && clearInterval(inter);
      };
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }, [refetch, address, balance, selectedToken, fromChain, chain, initAllowance, sender]);
  const isAllowanceLow = useMemo(() => {
    if (!selectedToken || !allowance) {
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
