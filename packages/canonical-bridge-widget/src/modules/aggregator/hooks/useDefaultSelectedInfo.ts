import { useEffect } from 'react';

import { useAppDispatch } from '@/modules/store/StoreProvider';
import { setSendValue } from '@/modules/transfer/action';
import { useSelection } from '@/modules/aggregator/hooks/useSelection';
import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';

export function useDefaultSelectedInfo() {
  const { isReady, defaultSelectedInfo } = useAggregator();
  const { selectDefault } = useSelection();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isReady) {
      selectDefault(defaultSelectedInfo);
      dispatch(setSendValue(defaultSelectedInfo.amount));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);
}
