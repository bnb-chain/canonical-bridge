import { nativeTokenMap } from '@/core/constants';
import { useAggregator } from '@/modules/aggregator/providers/AggregatorProvider';
import { useAppSelector } from '@/modules/store/StoreProvider';

export const useGetNativeToken = () => {
  const aggregator = useAggregator();
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  if (fromChain?.id) {
    if (aggregator.nativeCurrencies[fromChain.id]) {
      return aggregator.nativeCurrencies[fromChain.id].symbol;
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
