import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setSendValue } from '@/modules/transfer/action';
import { useSelection } from '@/modules/aggregator/hooks/useSelection';
import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';

export function useDefaultSelectedInfo() {
  const { isReady, defaultSelectedInfo, chainConfigs } = useAggregator();
  const { selectDefault, selectFirstChain } = useSelection();
  const dispatch = useAppDispatch();
  const sendValue = useAppSelector((state) => state.transfer.sendValue);

  useEffect(() => {
    if (isReady) {
      selectDefault(defaultSelectedInfo);
      dispatch(setSendValue(sendValue || defaultSelectedInfo.amount));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  useEffect(() => {
    selectFirstChain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainConfigs]);
}
