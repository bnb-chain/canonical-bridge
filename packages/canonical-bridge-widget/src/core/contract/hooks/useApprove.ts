import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { useCallback, useState } from 'react';

import { bridgeSDK } from '@/core/constants/bridgeSDK';

export const useApprove = () => {
  const { address } = useAccount();
  const [isLoadingApprove, setIsLoadingApprove] = useState(false);
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const approveErc20Token = useCallback(
    async (tokenAddress: string, spender: `0x${string}`, amount: bigint) => {
      if (!address || !walletClient || !amount || !spender || !publicClient) return;

      try {
        setIsLoadingApprove(true);
        const hash = await bridgeSDK.approveToken({
          walletClient,
          tokenAddress: tokenAddress as `0x${string}`,
          amount,
          address,
          spender,
        });
        // TODO: There is a time gap between the transaction is sent and getting the latest allowance.
        // May need to adjust allowance refetching interval period.
        const transaction = await publicClient.waitForTransactionReceipt({
          hash: hash,
          timeout: 1000 * 60,
          confirmations: 3,
        });
        // eslint-disable-next-line no-console
        console.log('approve tx:', transaction);
        return hash;
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.log(e, e.message);
      } finally {
        setIsLoadingApprove(false);
      }
    },
    [walletClient, publicClient, address],
  );
  return {
    approveErc20Token,
    isLoadingApprove,
  };
};