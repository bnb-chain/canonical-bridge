import { useAccount, useContractRead } from 'wagmi';

import { ERC20_TOKEN } from '../abi';

export const useGetTokenBalance = ({ tokenAddress }: { tokenAddress: `0x${string}` }) => {
  const { address } = useAccount();
  const {
    data: balance,
    isError,
    error,
    refetch,
  } = useContractRead({
    abi: ERC20_TOKEN,
    address: tokenAddress,
    functionName: 'balanceOf', //
    args: [address as `0x${string}`],
    staleTime: 5000,
    enabled: !!address && !!tokenAddress,
  });
  return {
    balance,
    isError,
    error,
    refetch,
  };
};
