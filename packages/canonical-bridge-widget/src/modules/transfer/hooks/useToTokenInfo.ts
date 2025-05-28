import { useCallback } from 'react';

import { useAppSelector } from '@/modules/store/StoreProvider';

export const useToTokenInfo = () => {
  const toTokenInfo = useAppSelector((state) => state.transfer.toToken);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  const getToDecimals = useCallback(() => {
    return {
      cBridge: toTokenInfo?.cBridge?.raw?.token.decimal || 0,
      deBridge: toTokenInfo?.deBridge?.raw?.decimals || 0,
      stargate: selectedToken?.stargate?.raw?.token?.decimals || 0,
      layerZero: selectedToken?.layerZero?.raw?.decimals || 0,
      meson: selectedToken?.meson?.raw?.decimals || 0,
      mayan: selectedToken?.mayan?.raw?.decimals || 0,
    };
  }, [toTokenInfo, selectedToken]);
  const getToTokenAddress = useCallback(() => {
    return {
      cBridge: toTokenInfo?.cBridge?.raw?.token.address || '',
      deBridge: toTokenInfo?.deBridge?.raw?.address || '',
      stargate: toTokenInfo?.stargate?.raw?.token?.address || '',
      layerZero: toTokenInfo?.layerZero?.raw?.address || '',
      meson: toTokenInfo?.meson?.raw?.addr || '',
      mayan: toTokenInfo?.mayan?.raw?.contract || '',
    };
  }, [toTokenInfo]);

  const getToTokenSymbol = useCallback(() => {
    return {
      cBridge: toTokenInfo?.cBridge?.raw?.token.symbol || '',
      deBridge: toTokenInfo?.deBridge?.raw?.symbol || '',
      stargate: toTokenInfo?.stargate?.raw?.token?.symbol || '',
      layerZero: toTokenInfo?.layerZero?.raw?.symbol || '',
      meson: toTokenInfo?.meson?.raw?.id?.toUpperCase() || '',
      mayan: toTokenInfo?.mayan?.raw?.symbol || '',
    };
  }, [
    toTokenInfo?.cBridge?.raw?.token.symbol,
    toTokenInfo?.deBridge?.raw?.symbol,
    toTokenInfo?.stargate?.raw?.token?.symbol,
    toTokenInfo?.layerZero?.raw?.symbol,
    toTokenInfo?.meson?.raw?.id,
    toTokenInfo?.mayan?.raw?.symbol,
  ]);

  return { toTokenInfo, getToDecimals, getToTokenAddress, getToTokenSymbol };
};
