import { useEffect } from 'react';

import { useBridgeConfigs } from '@/modules/bridges';
import { useAppDispatch } from '@/modules/store/StoreProvider';
import { setSendValue } from '@/modules/transfer/action';
import { useSetSelectInfo } from '@/modules/transfer/hooks/useSetSelectInfo';

export function useDefaultSelectedInfo() {
  const { isReady, defaultSelectedInfo } = useBridgeConfigs();
  const { setSelectInfo } = useSetSelectInfo();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isReady) {
      setSelectInfo({
        fromChainId: defaultSelectedInfo.fromChainId,
        toChainId: defaultSelectedInfo.toChainId,
        tokenSymbol: defaultSelectedInfo.tokenSymbol,
        tokenAddress: defaultSelectedInfo.tokenAddress,
      });
      dispatch(setSendValue(defaultSelectedInfo.amount));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);
}
