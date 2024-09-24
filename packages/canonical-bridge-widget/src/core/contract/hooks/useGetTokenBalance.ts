import { useAccount, useBalance, useReadContract } from 'wagmi';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { isNativeToken } from '@/core/utils/address';

import { ERC20_TOKEN } from '../abi';

export const useGetTokenBalance = ({ tokenAddress }: { tokenAddress: `0x${string}` }) => {
  const { address } = useAccount();
  const { data: nativeBalance } = useBalance({ address });
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const {
    data: balance,
    isError,
    error,
    refetch,
  } = useReadContract({
    abi: ERC20_TOKEN,
    address: tokenAddress,
    functionName: 'balanceOf', //
    args: [address as `0x${string}`],
    query: {
      staleTime: 10000,
      enabled: !!address && !!tokenAddress && selectedToken && !isNativeToken(tokenAddress),
    },
  });
  return {
    balance: isNativeToken(tokenAddress) ? nativeBalance?.value : balance,
    isError,
    error,
    refetch,
  };
};
