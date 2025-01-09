import { useEffect } from 'react';

import { useAppDispatch } from '@/modules/store/StoreProvider';
import { setSendValue } from '@/modules/transfer/action';
import { useSelection } from '@/modules/aggregator/hooks/useSelection';
import { useBridgeConfig } from '@/index';

export function useDefaultSelect() {
  const { selectDefault } = useSelection();
  const dispatch = useAppDispatch();

  const bridgeConfig = useBridgeConfig();

  const { defaultAmount, defaultFromChainId, defaultToChainId, defaultTokenAddress, providers } =
    bridgeConfig.transfer;

  const hasAvailableProvider = providers?.some((e) => !!e.config);

  useEffect(() => {
    if (hasAvailableProvider) {
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
    hasAvailableProvider,
  ]);
}
