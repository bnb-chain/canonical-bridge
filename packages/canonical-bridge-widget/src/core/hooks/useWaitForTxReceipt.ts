import { useAccount } from 'wagmi';

import { TIME } from '@/core/constants';

export function useWaitForTxReceipt() {
  const { connector } = useAccount();

  return {
    async waitForTxReceipt(params: {
      publicClient: any;
      hash: `0x${string}` | string;
      timeout?: number;
      confirmations?: number;
    }) {
      const { publicClient, hash, timeout, confirmations } = params;
      return await publicClient.waitForTransactionReceipt({
        hash,
        timeout: timeout ?? connector?.id === 'walletConnect' ? TIME.SECOND * 20 : TIME.MINUTE,
        confirmations,
      });
    },
  };
}
