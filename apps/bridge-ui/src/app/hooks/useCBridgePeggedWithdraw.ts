'use client';
import { PEGGED_TOKEN_BRIDGE } from '@/bridges/cbridge/abi/peggedTokenBridge';
import { PEGGED_TOKEN_BRIDGE_V2 } from '@/bridges/cbridge/abi/peggedTokenBridgeV2';
import { CBridgeTransactionResponse } from '@/bridges/cbridge/types';
import { getTransferId } from '@/bridges/cbridge/utils';
import { useGetEstimatedGas } from '@/contract/hooks/useGetEstimatedGas';
import { useAccount } from '@bridge/wallet';
import { useEffect, useState } from 'react';
import { useNetwork, usePublicClient, useWalletClient } from 'wagmi';

export const useCBridgePeggedWithdraw = ({
  tokenAddress,
  bridgeAddress, // PeggedTokenBridge.sol or PeggedTokenBridgeV2.sol
  amount,
  peggedChainId,
  destinationChainId,
  bridge_version, // 0 or 2 ==> PeggedTokenBridge.sol or PeggedTokenBridgeV2.sol
  enable = false,
}: {
  tokenAddress: `0x${string}`;
  bridgeAddress: `0x${string}`;
  amount: number;
  peggedChainId: number;
  destinationChainId: number;
  bridge_version: number;
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
  // CBridge withdraw
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
          chain.id !== peggedChainId ||
          !bridge_version ||
          !enable
        ) {
          return;
        }
        const nonce = new Date().getTime();
        const args = {
          address: bridgeAddress,
          abi:
            bridge_version === 0
              ? (PEGGED_TOKEN_BRIDGE as any)
              : (PEGGED_TOKEN_BRIDGE_V2 as any),
          functionName: 'burn',
          account: address as `0x${string}`,
          args: [tokenAddress, amount, address as `0x${string}`, nonce],
        };
        // Get estimated gas
        const { gas, gasPrice } = await getEstimatedGas(args);
        const burn_id =
          bridge_version === 0
            ? getTransferId('withdraw', [
                address,
                tokenAddress,
                String(amount),
                address,
                String(nonce),
                String(peggedChainId),
              ])
            : getTransferId('withdraw2', [
                address,
                tokenAddress,
                String(amount),
                String(destinationChainId),
                address,
                String(nonce),
                String(peggedChainId),
                bridgeAddress,
              ]);
        // eslint-disable-next-line no-console
        console.log('burn id', burn_id);
        const send = async () => {
          return await walletClient.writeContract({
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
            transferId: burn_id,
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
    amount,
    bridgeAddress,
    bridge_version,
    chain,
    destinationChainId,
    peggedChainId,
    tokenAddress,
    walletClient,
    getEstimatedGas,
    enable,
  ]);
  return response;
};
