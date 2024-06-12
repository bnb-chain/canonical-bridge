import { CBRIDGE } from '@/bridges/cbridge/abi/bridge';
import { getTransferId } from '@/bridges/cbridge/utils';
import { useGetEstimatedGas } from '@/contract/hooks/useGetEstimatedGas';
import { useAccount } from '@bridge/wallet';
import { useCallback } from 'react';
import { useWalletClient } from 'wagmi';

export const useCBridgePoolBasedTransfer = () => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { getEstimatedGas } = useGetEstimatedGas();

  const poolBasedCBridgeTransfer = useCallback(
    async ({
      tokenAddress,
      bridgeAddress, // OriginalTokenVault.sol or OriginalTokenVaultV2.sol
      amount,
      toChainId,
      fromChainId,
      max_slippage,
    }: {
      tokenAddress: `0x${string}`;
      bridgeAddress: `0x${string}`;
      amount: number;
      toChainId: number;
      fromChainId: number;
      max_slippage: number;
    }) => {
      try {
        if (walletClient && address) {
          const nonce = new Date().getTime();
          const args = {
            address: bridgeAddress, // Bridge.sol
            abi: CBRIDGE as any,
            functionName: 'send',
            account: address as `0x${string}`,
            args: [
              address as `0x${string}`,
              tokenAddress,
              amount,
              toChainId,
              nonce,
              max_slippage,
            ],
          };
          // Get estimated gas
          const { gas, gasPrice } = await getEstimatedGas(args);
          const transfer_id = getTransferId('pool', [
            address,
            address,
            tokenAddress,
            String(amount),
            String(toChainId),
            String(nonce),
            String(fromChainId),
          ]);
          const hash = await walletClient.writeContract({
            ...args,
            gas,
            gasPrice,
          });
          // eslint-disable-next-line no-console
          console.log('transfer hash', hash, 'transfer id', transfer_id);
          return hash;
        }
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.log(e, e.message);
      }
    },
    [address, walletClient, getEstimatedGas]
  );
  return {
    poolBasedCBridgeTransfer,
  };
};
