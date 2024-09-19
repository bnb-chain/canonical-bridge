import { useCallback } from 'react';

import { useAppSelector } from '@/modules/store/StoreProvider';

export const useToTokenInfo = () => {
  const toTokenInfo = useAppSelector((state) => state.transfer.toToken);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  const getToDecimals = useCallback(() => {
    return {
      cBridge: toTokenInfo?.cBridge?.raw?.token.decimal || 0,
      deBridge: toTokenInfo?.deBridge?.raw?.decimals || 0,
      stargate: selectedToken?.stargate?.raw?.decimals || 0,
      layerZero: selectedToken?.layerZero?.raw?.decimals || 0,
    };
  }, [toTokenInfo, selectedToken]);
  const getToTokenAddress = useCallback(() => {
    return {
      cBridge: toTokenInfo?.cBridge?.raw?.token.address || '',
      deBridge: toTokenInfo?.deBridge?.raw?.address || '',
      stargate: toTokenInfo?.stargate?.raw?.address || '',
      layerZero: toTokenInfo?.layerZero?.raw?.address || '',
    };
  }, [toTokenInfo]);

  const getToTokenSymbol = useCallback(() => {
    return {
      cBridge: toTokenInfo?.cBridge?.raw?.token.symbol || '',
      deBridge: toTokenInfo?.deBridge?.raw?.symbol || '',
      stargate: toTokenInfo?.stargate?.raw?.symbol || '',
      layerZero: toTokenInfo?.layerZero?.raw?.symbol || '',
    };
  }, [
    toTokenInfo?.cBridge?.raw?.token.symbol,
    toTokenInfo?.deBridge?.raw?.symbol,
    toTokenInfo?.stargate?.raw?.symbol,
    toTokenInfo?.layerZero?.raw?.symbol,
  ]);

  return { toTokenInfo, getToDecimals, getToTokenAddress, getToTokenSymbol };
};
