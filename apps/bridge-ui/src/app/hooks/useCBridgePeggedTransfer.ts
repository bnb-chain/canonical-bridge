'use client';
import { ORIGINAL_TOKEN_VAULT } from '@/bridges/cbridge/abi/originalTokenVault';
import { ORIGINAL_TOKEN_VAULT_V2 } from '@/bridges/cbridge/abi/originalTokenVaultV2';
import { PEGGED_TOKEN_BRIDGE } from '@/bridges/cbridge/abi/peggedTokenBridge';
import { PEGGED_TOKEN_BRIDGE_V2 } from '@/bridges/cbridge/abi/peggedTokenBridgeV2';
import { getTransferId } from '@/bridges/cbridge/utils';
import { useGetEstimatedGas } from '@/contract/hooks/useGetEstimatedGas';
import { useAccount } from '@bridge/wallet';
import { useCallback } from 'react';
import { usePublicClient, useWalletClient } from 'wagmi';

/**
 * Only this hook when handling cBridge pegged(mint/burn) transfer
 */
export const useCBridgePeggedTransfer = () => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { getEstimatedGas } = useGetEstimatedGas();

  // CBridge deposit
  const peggedCBridgeDeposit = useCallback(
    async ({
      tokenAddress,
      bridgeAddress, // OriginalTokenVault.sol or OriginalTokenVaultV2.sol
      amount,
      peggedChainId,
      originalChainId,
      vault_version, // 0 or 2
    }: {
      tokenAddress: `0x${string}`;
      bridgeAddress: `0x${string}`;
      amount: number;
      peggedChainId: number;
      originalChainId: number;
      vault_version: number;
    }) => {
      try {
        if (walletClient && publicClient && address) {
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
          const hash = await walletClient.writeContract({
            ...args,
            gas,
            gasPrice,
          });
          // eslint-disable-next-line no-console
          console.log('tx hash', hash, 'deposit id', deposit_id);
          return hash;
        }
      } catch (e: any) {
        console.log(e, e.message);
      }
    },
    [address, walletClient, publicClient, getEstimatedGas]
  );

  // CBridge withdraw
  const peggedCBridgeWithdraw = useCallback(
    async ({
      tokenAddress,
      bridgeAddress, // PeggedTokenBridge.sol or PeggedTokenBridgeV2.sol
      amount,
      peggedChainId,
      destinationChainId,
      bridge_version, // 0 or 2
    }: {
      tokenAddress: `0x${string}`;
      bridgeAddress: `0x${string}`;
      amount: number;
      peggedChainId: number;
      destinationChainId: number;
      bridge_version: number;
    }) => {
      try {
        if (walletClient && publicClient && address) {
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
          const hash = await walletClient.writeContract({
            ...args,
            gas,
            gasPrice,
          });
          console.log('transfer hash', hash, 'burn id', burn_id);
          return hash;
        }
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.log(e, e.message);
      }
    },
    [address, walletClient, publicClient, getEstimatedGas]
  );

  return {
    peggedCBridgeDeposit,
    peggedCBridgeWithdraw,
  };
};
