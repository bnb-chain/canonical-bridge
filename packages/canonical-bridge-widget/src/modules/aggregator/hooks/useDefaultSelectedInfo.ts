import { useEffect } from 'react';

import { useAppDispatch } from '@/modules/store/StoreProvider';
import { setSendValue } from '@/modules/transfer/action';
import { useBridgeConfig } from '@/modules/aggregator/components/BridgeConfigProvider';
import { useSelection } from '@/modules/aggregator/hooks/useSelection';

export function useDefaultSelectedInfo() {
  const { isReady, defaultSelectedInfo } = useBridgeConfig();
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
