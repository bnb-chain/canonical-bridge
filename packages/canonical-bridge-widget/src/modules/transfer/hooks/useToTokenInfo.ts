import { useCallback } from 'react';

import { useAppSelector } from '@/modules/store/StoreProvider';

export const useToTokenInfo = () => {
  const toTokenInfo = useAppSelector((state) => state.transfer.toToken);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  const getToDecimals = useCallback(() => {
    return {
      cBridge: toTokenInfo?.rawData.cBridge?.token.decimal || 0,
      deBridge: toTokenInfo?.rawData.deBridge?.decimals || 0,
      stargate: selectedToken?.rawData.stargate?.decimals || 0,
      layerZero: selectedToken?.rawData.layerZero?.decimals || 0,
    };
  }, [toTokenInfo, selectedToken]);
  const getToTokenAddress = useCallback(() => {
    return {
      cBridge: toTokenInfo?.rawData.cBridge?.token.address || '',
      deBridge: toTokenInfo?.rawData.deBridge?.address || '',
      stargate: toTokenInfo?.rawData.stargate?.address || '',
      layerZero: toTokenInfo?.rawData.layerZero?.address || '',
    };
  }, [toTokenInfo]);

  const getToTokenSymbol = useCallback(() => {
    return {
      cBridge: toTokenInfo?.rawData.cBridge?.token.symbol || '',
      deBridge: toTokenInfo?.rawData.deBridge?.symbol || '',
      stargate: toTokenInfo?.rawData.stargate?.symbol || '',
      layerZero: toTokenInfo?.rawData.layerZero?.symbol || '',
    };
  }, [
    toTokenInfo?.rawData.cBridge?.token.symbol,
    toTokenInfo?.rawData.deBridge?.symbol,
    toTokenInfo?.rawData.stargate?.symbol,
    toTokenInfo?.rawData.layerZero?.symbol,
  ]);

  return { toTokenInfo, getToDecimals, getToTokenAddress, getToTokenSymbol };
};
