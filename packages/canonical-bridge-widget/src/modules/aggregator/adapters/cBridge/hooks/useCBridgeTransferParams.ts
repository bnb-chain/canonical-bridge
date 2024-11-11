import { useMemo } from 'react';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useBridgeSDK } from '@/core/hooks/useBridgeSDK';
import { isNativeToken } from '@/core/utils/address';

export const useCBridgeTransferParams = () => {
  const { address } = useAccount();
  const bridgeSDK = useBridgeSDK();

  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const max_slippage = useAppSelector((state) => state.transfer.slippage);
  const isPegged = useMemo(() => selectedToken?.isPegged || false, [selectedToken]);
  const bridgeAddress = useMemo(() => {
    try {
      if (
        !fromChain ||
        (isPegged && !selectedToken?.cBridge?.peggedConfig) ||
        (!isPegged && !fromChain?.cBridge?.raw) ||
        !bridgeSDK?.cBridge
      ) {
        return null;
      }
      return bridgeSDK.cBridge.getTransferAddress({
        fromChainId: fromChain?.id as number,
        isPegged,
        peggedConfig: selectedToken?.cBridge?.peggedConfig,
        chainConfig: fromChain?.cBridge?.raw,
      });
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }, [selectedToken, fromChain, isPegged, bridgeSDK?.cBridge]);

  // Mint/deposit or burn/withdraw
  const transferType = useMemo(() => {
    if (selectedToken?.cBridge?.peggedConfig?.org_chain_id === fromChain?.id) {
      return 'deposit';
    }
    if (selectedToken?.cBridge?.peggedConfig?.pegged_chain_id === fromChain?.id) {
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
      !address ||
      !bridgeSDK?.cBridge
    ) {
      return null;
    }
    const nonce = new Date().getTime();

    let amount = 0n;
    try {
      if (selectedToken.isPegged === false) {
        amount = parseUnits(
          String(sendValue),
          selectedToken?.cBridge?.raw?.token.decimal as number,
        ); // Convert to big number
      } else if (transferType === 'deposit') {
        amount = parseUnits(
          String(sendValue),
          selectedToken?.cBridge?.peggedConfig?.org_token.token.decimal as number,
        );
      } else if (transferType === 'withdraw') {
        amount = parseUnits(
          String(sendValue),
          selectedToken?.cBridge?.peggedConfig?.pegged_token.token.decimal as number,
        );
      }
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log(e);
    }

    return bridgeSDK.cBridge.getTransferParams({
      amount,
      isPegged,
      toChainId: toChain.id,
      tokenAddress: selectedToken?.address as `0x${string}`,
      address: address as `0x${string}`,
      maxSlippage: max_slippage,
      transferType: transferType ? transferType : undefined,
      peggedConfig: selectedToken.cBridge?.peggedConfig,
      isNativeToken: isNativeToken(selectedToken.address),
      nonce,
    });
  }, [
    sendValue,
    toChain,
    selectedToken,
    address,
    isPegged,
    transferType,
    max_slippage,
    bridgeSDK?.cBridge,
  ]);

  // Arguments for bridge smart contract
  const args = useMemo(() => {
    const peggedConfig = selectedToken?.cBridge?.peggedConfig;
    if (
      !argument ||
      (isPegged && !transferType) ||
      !address ||
      !bridgeAddress ||
      !bridgeSDK?.cBridge ||
      !selectedToken
    ) {
      return null;
    }
    const abi = bridgeSDK.cBridge.getABI({
      isPegged,
      transferType: transferType || undefined,
      peggedConfig,
    });
    const functionName = bridgeSDK.cBridge.getTransferFunction({
      isPegged,
      isNativeToken: isNativeToken(selectedToken?.address),
      transferType: transferType || undefined,
    });
    return {
      address: bridgeAddress as `0x${string}`,
      abi: abi,
      functionName: functionName,
      account: address as `0x${string}`,
      args: argument,
    };
  }, [bridgeAddress, transferType, selectedToken, isPegged, address, argument, bridgeSDK?.cBridge]);
  return { args, bridgeAddress };
};
