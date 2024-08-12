import { useAppSelector } from '@/core/store/hooks';

export const useToTokenInfo = () => {
  const toTokenInfo = useAppSelector((state) => state.transfer.toToken);

  const getToDecimals = () => {
    return {
      cBridge: toTokenInfo?.rawData.cBridge?.token.decimal || 0,
      deBridge: toTokenInfo?.rawData.deBridge?.decimals || 0,
    };
  };
  const getToTokenAddress = () => {
    return {
      cBridge: toTokenInfo?.rawData.cBridge?.token.address || '',
      deBridge: toTokenInfo?.rawData.deBridge?.address || '',
    };
  };
  const getToTokenSymbol = () => {
    return {
      cBridge: toTokenInfo?.rawData.cBridge?.token.symbol || '',
      deBridge: toTokenInfo?.rawData.deBridge?.symbol || '',
    };
  };

  return { toTokenInfo, getToDecimals, getToTokenAddress, getToTokenSymbol };
};
