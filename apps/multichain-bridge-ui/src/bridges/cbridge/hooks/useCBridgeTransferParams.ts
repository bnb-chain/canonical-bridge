import { CBRIDGE } from '@/bridges/cbridge/abi/bridge';
import { ORIGINAL_TOKEN_VAULT } from '@/bridges/cbridge/abi/originalTokenVault';
import { ORIGINAL_TOKEN_VAULT_V2 } from '@/bridges/cbridge/abi/originalTokenVaultV2';
import { PEGGED_TOKEN_BRIDGE } from '@/bridges/cbridge/abi/peggedTokenBridge';
import { PEGGED_TOKEN_BRIDGE_V2 } from '@/bridges/cbridge/abi/peggedTokenBridgeV2';
import { useTransferConfigs } from '@/bridges/index';
import { useAppSelector } from '@/store/hooks';
import { useAccount } from '@bridge/wallet';
import { useMemo } from 'react';
import { parseUnits } from 'viem';

export const useCBridgeTransferParams = () => {
  const { chains } = useTransferConfigs();
  const { address } = useAccount();
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const max_slippage = 30000;
  const isPegged = useMemo(
    () => selectedToken?.isPegged || false,
    [selectedToken]
  );
  const bridgeAddress = useMemo(() => {
    if (fromChain) {
      if (isPegged) {
        const peggedConfig = selectedToken?.peggedRawData?.cbridge;
        if (peggedConfig?.org_chain_id === fromChain.id) {
          // cBridge deposit
          return peggedConfig.pegged_deposit_contract_addr;
        } else if (peggedConfig?.pegged_chain_id === fromChain.id) {
          // cBridge burn
          return peggedConfig.pegged_burn_contract_addr;
        }
      } else {
        const cBridgeChainConfig = chains.find(
          (chain) => chain.id === fromChain.id
        );
        if (cBridgeChainConfig?.rawData?.cbridge?.contract_addr) {
          return cBridgeChainConfig.rawData.cbridge?.contract_addr;
        } else {
          // eslint-disable-next-line no-console
          console.log('No cBridge bridge address found');
          return '';
        }
      }
    } else {
      return '';
    }
  }, [selectedToken, fromChain, chains, isPegged]);

  // Mint/deposit or burn/withdraw
  const transferType = useMemo(() => {
    if (selectedToken?.peggedRawData?.cbridge?.org_chain_id === fromChain?.id) {
      return 'deposit';
    }
    if (
      selectedToken?.peggedRawData?.cbridge?.pegged_chain_id === fromChain?.id
    ) {
      return 'withdraw';
    }
    return '';
  }, [selectedToken, fromChain?.id]);

  const argument = useMemo(() => {
    if (
      !sendValue ||
      sendValue === '0' ||
      !toChain ||
      !selectedToken ||
      !address
    ) {
      return null;
    }
    const nonce = new Date().getTime();

    let amount = 0n;
    if (selectedToken.isPegged === false) {
      amount = parseUnits(
        String(sendValue),
        selectedToken?.rawData?.cbridge?.token.decimal as number
      ); // Convert to big number
    } else if (transferType === 'deposit') {
      amount = parseUnits(
        String(sendValue),
        selectedToken?.peggedRawData?.cbridge?.org_token.token.decimal as number
      );
    } else if (transferType === 'withdraw') {
      amount = parseUnits(
        String(sendValue),
        selectedToken?.peggedRawData?.cbridge?.pegged_token.token
          .decimal as number
      );
    }
    return isPegged === false
      ? [
          address as `0x${string}`,
          selectedToken?.address,
          amount,
          toChain?.id,
          nonce,
          max_slippage,
        ]
      : transferType === 'deposit'
      ? [
          selectedToken?.address,
          amount,
          toChain?.id,
          address as `0x${string}`,
          nonce,
        ]
      : transferType === 'withdraw'
      ? [selectedToken?.address, amount, address as `0x${string}`, nonce]
      : null;
  }, [sendValue, toChain, selectedToken, address, isPegged, transferType]);

  // Arguments for bridge smart contract
  const args = useMemo(() => {
    const peggedConfig = selectedToken?.peggedRawData?.cbridge;
    if (
      !argument ||
      (isPegged && !transferType) ||
      !address ||
      !bridgeAddress
    ) {
      return null;
    }
    return {
      address: bridgeAddress as `0x${string}`,
      abi:
        isPegged === false
          ? CBRIDGE // Pool-based transfer
          : transferType === 'deposit'
          ? peggedConfig?.vault_version === 0
            ? ORIGINAL_TOKEN_VAULT
            : ORIGINAL_TOKEN_VAULT_V2
          : transferType === 'withdraw'
          ? peggedConfig?.bridge_version === 0
            ? PEGGED_TOKEN_BRIDGE
            : PEGGED_TOKEN_BRIDGE_V2
          : (undefined as any),
      functionName:
        isPegged === false
          ? 'send'
          : transferType === 'deposit'
          ? 'deposit'
          : transferType === 'withdraw'
          ? 'burn'
          : '',
      account: address as `0x${string}`,
      args: argument,
    };
  }, [bridgeAddress, transferType, selectedToken, isPegged, address, argument]);
  return { args, bridgeAddress };
};
