import { useMemo } from 'react';
import { useAccount } from 'wagmi';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useBridgeSDK } from '@/core/hooks/useBridgeSDK';

export const useCBridgeTransferParams = () => {
  const bridgeSDK = useBridgeSDK();

  const { address } = useAccount();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const slippage = useAppSelector((state) => state.transfer.slippage);

  return useMemo(() => {
    if (fromChain && toChain && selectedToken && address && bridgeSDK.cBridge) {
      const { args, bridgeAddress } = bridgeSDK.cBridge.getTransactionParams({
        fromChain,
        toChain,
        fromToken: selectedToken,
        userAddress: address,
        sendValue,
        slippage,
      });
      return { args, bridgeAddress };
    }

    return {
      args: null,
      bridgeAddress: null,
    };
  }, [address, bridgeSDK.cBridge, fromChain, selectedToken, sendValue, slippage, toChain]);
};
