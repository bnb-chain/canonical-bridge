import { useAppSelector } from '@/core/store/hooks';

export const deBridgeNativeTokenMap = {
  1: 'ETH',
  10: 'ETH',
  56: 'BNB',
  137: 'MATIC',
  250: 'FTM',
  8453: 'ETH',
  42161: 'ETH',
  43114: 'ETH',
  59144: 'ETH',
  7565164: 'SOL',
  100000001: 'NEON',
};

export const useGetNativeToken = () => {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  if (fromChain?.id) {
    const nativeToken = fromChain?.rawData?.cBridge?.gas_token_symbol;
    if (nativeToken) {
      return nativeToken;
    } else {
      return deBridgeNativeTokenMap[fromChain.id as keyof typeof deBridgeNativeTokenMap];
    }
  }
  return null;
};
