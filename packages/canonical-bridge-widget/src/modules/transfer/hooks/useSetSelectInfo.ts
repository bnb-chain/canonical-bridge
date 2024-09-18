import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { isSameAddress } from '@/core/utils/address';
import { setFromChain, setSelectedToken, setToChain, setToToken } from '@/modules/transfer/action';
import { useBridgeConfig } from '@/modules/aggregator/components/BridgeConfigProvider';

interface SetSelectionInfoParams {
  direction?: 'from' | 'to';
  fromChainId?: number;
  toChainId?: number;
  tokenSymbol?: string;
  tokenAddress?: string;
}

export function useSetSelectInfo() {
  const { getFromChains, getToChains, getTokens, getToToken } = useBridgeConfig();

  const dispatch = useAppDispatch();
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  return {
    setSelectInfo(params: SetSelectionInfoParams) {},
  };
}
