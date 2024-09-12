import { nativeTokenMap } from '@/core/constants';
import { useAppSelector } from '@/modules/store/StoreProvider';

export const useGetNativeToken = () => {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const evmConnectData = useAppSelector((state) => state.bridges.chainConfigs);
  const chain = evmConnectData.find((item) => item.id === fromChain?.id);

  if (chain?.nativeCurrency.symbol) return chain.nativeCurrency.symbol;
  if (fromChain?.id) {
    const nativeToken = fromChain?.rawData?.cBridge?.gas_token_symbol;
    if (nativeToken) {
      return nativeToken;
    } else {
      return nativeTokenMap[fromChain.id as keyof typeof nativeTokenMap];
    }
  }
  return null;
};
