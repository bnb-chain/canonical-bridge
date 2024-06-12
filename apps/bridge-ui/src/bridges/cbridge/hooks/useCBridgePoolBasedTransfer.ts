import { CBRIDGE } from '@/bridges/cbridge/abi/bridge';
import { CBridgeTransactionResponse } from '@/bridges/cbridge/types';
import { getTransferId } from '@/bridges/cbridge/utils';
import { useGetEstimatedGas } from '@/contract/hooks/useGetEstimatedGas';
import { useAccount } from '@bridge/wallet';
import { useEffect, useState } from 'react';
import { parseUnits } from 'viem';
import { useNetwork, useWalletClient } from 'wagmi';

export const useCBridgePoolBasedTransfer = ({
  tokenAddress,
  bridgeAddress, // OriginalTokenVault.sol or OriginalTokenVaultV2.sol
  amount: transferAmount,
  toChainId,
  fromChainId,
  max_slippage = 3000,
  decimal,
  enable = false,
}: {
  tokenAddress: `0x${string}`;
  bridgeAddress: `0x${string}`;
  amount: string;
  toChainId: number;
  fromChainId: number;
  max_slippage: number;
  decimal: number;
  enable: boolean;
}) => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { getEstimatedGas } = useGetEstimatedGas();
  const { chain } = useNetwork();
  const [response, setResponse] = useState<CBridgeTransactionResponse>({
    data: null,
    isLoading: false,
    isError: false,
    error: null,
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!mounted) return;
        setResponse({
          data: null,
          isLoading: true,
          isError: false,
          error: null,
        });
        if (
          !walletClient ||
          !address ||
          !bridgeAddress ||
          !chain ||
          chain.id !== fromChainId ||
          !enable ||
          !transferAmount ||
          !tokenAddress ||
          !toChainId ||
          !fromChainId ||
          transferAmount === '0'
        ) {
          return;
        }
        console.log(transferAmount);
        if (walletClient && address) {
          const nonce = new Date().getTime();
          const amount = parseUnits(String(transferAmount), decimal); // Convert to big number
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

          const send = async () => {
            return await walletClient.writeContract({
              ...args,
              gas,
              gasPrice,
            });
          };
          console.log('transfer id', transfer_id);
          setResponse((value) => ({
            ...value,
            data: {
              gasFee: gas,
              gasPrice,
              transferId: transfer_id,
              send,
            },
          }));
        }
      } catch (error: any) {
        setResponse((value) => ({
          ...value,
          isError: true,
          error,
        }));
        // eslint-disable-next-line no-console
        console.log(error, error.message);
      } finally {
        setResponse((value) => ({
          ...value,
          isLoading: false,
        }));
      }
    })();
    return () => {
      mounted = false;
    };
  }, [
    address,
    transferAmount,
    decimal,
    bridgeAddress,
    fromChainId,
    getEstimatedGas,
    max_slippage,
    toChainId,
    walletClient,
    tokenAddress,
    enable,
    chain,
  ]);

  return response;
};
