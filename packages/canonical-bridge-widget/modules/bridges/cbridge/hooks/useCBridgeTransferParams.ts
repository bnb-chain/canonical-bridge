import { useMemo } from 'react';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';

import { useAppSelector } from '@/core/store/hooks';
import { bridgeSDK } from '@/core/constants/bridgeSDK';

export const useCBridgeTransferParams = () => {
  const { address } = useAccount();
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
        (isPegged && !selectedToken?.peggedRawData?.cBridge) ||
        (!isPegged && !fromChain?.rawData?.cBridge)
      ) {
        return null;
      }
      return bridgeSDK.cBridge.getTransferAddress({
        fromChainId: fromChain?.id as number,
        isPegged,
        peggedConfig: selectedToken?.peggedRawData?.cBridge,
        chainConfig: fromChain?.rawData?.cBridge,
      });
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }, [selectedToken, fromChain, isPegged]);

  // Mint/deposit or burn/withdraw
  const transferType = useMemo(() => {
    if (selectedToken?.peggedRawData?.cBridge?.org_chain_id === fromChain?.id) {
      return 'deposit';
    }
    if (selectedToken?.peggedRawData?.cBridge?.pegged_chain_id === fromChain?.id) {
      return 'withdraw';
    }
    return '';
  }, [selectedToken, fromChain?.id]);

  const argument = useMemo(() => {
    if (!sendValue || sendValue === '0' || !toChain || !selectedToken || !address) {
      return null;
    }
    const nonce = new Date().getTime();

    let amount = 0n;
    try {
      if (selectedToken.isPegged === false) {
        amount = parseUnits(
          String(sendValue),
          selectedToken?.rawData?.cBridge?.token.decimal as number,
        ); // Convert to big number
      } else if (transferType === 'deposit') {
        amount = parseUnits(
          String(sendValue),
          selectedToken?.peggedRawData?.cBridge?.org_token.token.decimal as number,
        );
      } else if (transferType === 'withdraw') {
        amount = parseUnits(
          String(sendValue),
          selectedToken?.peggedRawData?.cBridge?.pegged_token.token.decimal as number,
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
      peggedConfig: selectedToken.peggedRawData.cBridge,
      nonce,
    });
  }, [sendValue, toChain, selectedToken, address, isPegged, transferType, max_slippage]);

  // Arguments for bridge smart contract
  const args = useMemo(() => {
    const peggedConfig = selectedToken?.peggedRawData?.cBridge;
    if (!argument || (isPegged && !transferType) || !address || !bridgeAddress) {
      return null;
    }
    const abi = bridgeSDK.cBridge.getABI({
      isPegged,
      transferType: transferType || undefined,
      peggedConfig,
    });
    const functionName = bridgeSDK.cBridge.getTransferFunction({
      isPegged,
      transferType: transferType || undefined,
    });
    return {
      address: bridgeAddress as `0x${string}`,
      abi: abi,
      functionName: functionName,
      account: address as `0x${string}`,
      args: argument,
    };
  }, [bridgeAddress, transferType, selectedToken, isPegged, address, argument]);
  return { args, bridgeAddress };
};
