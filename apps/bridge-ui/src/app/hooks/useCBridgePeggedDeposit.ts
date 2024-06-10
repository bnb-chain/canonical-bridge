'use client';
import { ORIGINAL_TOKEN_VAULT } from '@/bridges/cbridge/abi/originalTokenVault';
import { ORIGINAL_TOKEN_VAULT_V2 } from '@/bridges/cbridge/abi/originalTokenVaultV2';
import { CBridgeTransactionResponse } from '@/bridges/cbridge/types';
import { getTransferId } from '@/bridges/cbridge/utils';
import { useGetEstimatedGas } from '@/contract/hooks/useGetEstimatedGas';
import { useAccount } from '@bridge/wallet';
import { useEffect, useState } from 'react';
import { useNetwork, usePublicClient, useWalletClient } from 'wagmi';

/**
 * Only this hook when handling cBridge pegged(mint / deposit) transfer
 */
export const useCBridgePeggedDeposit = ({
  tokenAddress,
  bridgeAddress, // OriginalTokenVault.sol or OriginalTokenVaultV2.sol
  amount,
  peggedChainId,
  originalChainId,
  vault_version, // 0 or 2 ==> OriginalTokenVault.sol or OriginalTokenVaultV2.sol
}: {
  tokenAddress: `0x${string}`;
  bridgeAddress: `0x${string}`;
  amount: number;
  peggedChainId: number;
  originalChainId: number;
  vault_version: number;
}) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { getEstimatedGas } = useGetEstimatedGas();

  const [response, setResponse] = useState<CBridgeTransactionResponse>({
    data: null,
    isLoading: false,
    isError: false,
    error: null,
  });

  // CBridge deposit
  useEffect(() => {
    let mounted = true;
    if (
      !walletClient ||
      !publicClient ||
      !address ||
      !chain ||
      chain.id !== originalChainId ||
      !tokenAddress ||
      !amount ||
      !peggedChainId
    ) {
      return;
    }
    (async () => {
      try {
        if (!mounted) return;
        setResponse({
          data: null,
          isLoading: true,
          isError: false,
          error: null,
        });

        const nonce = new Date().getTime();
        const args = {
          address: bridgeAddress,
          abi:
            vault_version === 0
              ? (ORIGINAL_TOKEN_VAULT as any)
              : (ORIGINAL_TOKEN_VAULT_V2 as any),
          functionName: 'deposit',
          account: address as `0x${string}`,
          args: [
            tokenAddress,
            amount,
            peggedChainId,
            address as `0x${string}`,
            nonce,
          ],
        };
        // Get estimated gas
        const { gas, gasPrice } = await getEstimatedGas(args);
        const deposit_id =
          vault_version === 0
            ? getTransferId('deposit', [
                address,
                tokenAddress,
                String(amount),
                String(peggedChainId),
                address,
                String(nonce),
                String(originalChainId),
              ])
            : getTransferId('deposit2', [
                address,
                tokenAddress,
                String(amount),
                String(peggedChainId),
                address,
                String(nonce),
                String(originalChainId),
                bridgeAddress,
              ]);
        // eslint-disable-next-line no-console
        console.log('deposit id', deposit_id);
        const send = () => {
          return walletClient.writeContract({
            ...args,
            gas,
            gasPrice,
          });
        };

        setResponse((value) => ({
          ...value,
          data: {
            gasFee: gas,
            gasPrice,
            transferId: deposit_id,
            send,
          },
        }));
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
    walletClient,
    publicClient,
    getEstimatedGas,
    chain,
    amount,
    tokenAddress,
    peggedChainId,
    originalChainId,
    vault_version,
    bridgeAddress,
  ]);

  return response;
};
