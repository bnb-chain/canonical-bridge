import { useTransferConfigs } from '@/bridges/main';
import { useAppSelector } from '@/store/hooks';

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
  const { chains } = useTransferConfigs();
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  if (fromChain?.id) {
    const nativeToken = chains.find((chain) => chain.id === fromChain.id)?.rawData?.cbridge
      ?.gas_token_symbol;
    if (nativeToken) {
      return nativeToken;
    } else {
      return deBridgeNativeTokenMap[fromChain.id as keyof typeof deBridgeNativeTokenMap];
    }
  }
  return null;
};
