import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setSendValue } from '@/modules/transfer/action';
import { useSelection } from '@/modules/aggregator/hooks/useSelection';
import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';
import { useCurrentWallet } from '@/modules/wallet/CurrentWalletProvider.tsx';

export function useDefaultSelectedInfo() {
  const { isReady, transferConfig } = useAggregator();
  const { selectDefault } = useSelection();
  const dispatch = useAppDispatch();
  const { chainId } = useCurrentWallet();
  const sendValue = useAppSelector((state) => state.transfer.sendValue);

  useEffect(() => {
    if (isReady) {
      selectDefault(transferConfig.defaultSelectedInfo);
      dispatch(setSendValue(sendValue || transferConfig.defaultSelectedInfo.amount));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, chainId]);
}
