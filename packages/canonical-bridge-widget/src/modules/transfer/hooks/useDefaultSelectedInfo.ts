import { useEffect } from 'react';

import { useAppDispatch } from '@/modules/store/StoreProvider';
import { setSendValue } from '@/modules/transfer/action';
import { useSetSelectInfo } from '@/modules/transfer/hooks/useSetSelectInfo';
import { useBridgeConfig } from '@/modules/aggregator/components/BridgeConfigProvider';

export function useDefaultSelectedInfo() {
  const { isReady, defaultSelectedInfo } = useBridgeConfig();
  const { setSelectInfo } = useSetSelectInfo();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isReady) {
      setSelectInfo({
        fromChainId: defaultSelectedInfo.fromChainId,
        toChainId: defaultSelectedInfo.toChainId,
        tokenAddress: defaultSelectedInfo.tokenAddress,
      });
      dispatch(setSendValue(defaultSelectedInfo.amount));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);
}
