import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { useCallback, useState } from 'react';

import { useBridgeSDK } from '@/core/hooks/useBridgeSDK';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { useWaitForTxReceipt } from '@/core/hooks/useWaitForTxReceipt';

export const useApprove = () => {
  const { address } = useAccount();
  const [isLoadingApprove, setIsLoadingApprove] = useState(false);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: walletClient } = useWalletClient() as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const publicClient = usePublicClient({ chainId: fromChain?.id }) as any;
  const bridgeSDK = useBridgeSDK();
  const { waitForTxReceipt } = useWaitForTxReceipt();

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
        const transaction = await waitForTxReceipt({
          publicClient,
          hash: hash,
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
    [address, walletClient, publicClient, bridgeSDK],
  );
  return {
    approveErc20Token,
    isLoadingApprove,
  };
};
