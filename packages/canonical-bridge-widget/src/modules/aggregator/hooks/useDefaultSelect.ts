import { useEffect } from 'react';

import { useAppDispatch } from '@/modules/store/StoreProvider';
import { setSendValue } from '@/modules/transfer/action';
import { useSelection } from '@/modules/aggregator/hooks/useSelection';
import { useBridgeConfig } from '@/index';
import { useAggregator } from '@/modules/aggregator/providers/AggregatorProvider';

export function useDefaultSelect() {
  const { selectDefault } = useSelection();
  const dispatch = useAppDispatch();

  const aggregator = useAggregator();
  const bridgeConfig = useBridgeConfig();

  const { defaultAmount, defaultFromChainId, defaultToChainId, defaultTokenAddress } =
    bridgeConfig.transfer;

  const hasAvailableAdapter = !!aggregator;

  useEffect(() => {
    if (hasAvailableAdapter) {
      selectDefault({
        fromChainId: defaultFromChainId,
        toChainId: defaultToChainId,
        tokenAddress: defaultTokenAddress,
      });
      dispatch(setSendValue(defaultAmount));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    defaultAmount,
    defaultFromChainId,
    defaultToChainId,
    defaultTokenAddress,
    hasAvailableAdapter,
  ]);
}
