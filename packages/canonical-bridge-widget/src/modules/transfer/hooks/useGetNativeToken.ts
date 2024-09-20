import { nativeTokenMap } from '@/core/constants';
import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';
import { useAppSelector } from '@/modules/store/StoreProvider';

export const useGetNativeToken = () => {
  const { nativeCurrencies } = useAggregator();
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  if (fromChain?.id) {
    if (nativeCurrencies[fromChain.id]) {
      return nativeCurrencies[fromChain.id];
    }

    const nativeToken = fromChain?.cBridge?.raw?.gas_token_symbol;
    if (nativeToken) {
      return nativeToken;
    } else {
      return nativeTokenMap[fromChain.id as keyof typeof nativeTokenMap];
    }
  }
  return null;
};
