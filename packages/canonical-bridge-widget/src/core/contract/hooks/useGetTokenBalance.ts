import { useAccount, useBalance, useReadContract } from 'wagmi';
import { isNativeToken } from '@bnb-chain/canonical-bridge-sdk';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { ERC20_TOKEN } from '@/core/contract/abi';

export const useGetTokenBalance = ({ tokenAddress }: { tokenAddress: `0x${string}` }) => {
  const { address } = useAccount();
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const { data: nativeBalance } = useBalance({ address, chainId: fromChain?.id });
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
