import { useMemo } from 'react';
import { TronWeb } from 'tronweb';

import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';

export function useTronWeb() {
  const { chainConfigs } = useAggregator();

  const tronWeb = useMemo(() => {
    const tron = chainConfigs.find((e) => e.chainType === 'tron');
    if (tron) {
      return new TronWeb({
        fullHost: tron.rpcUrl,
      });
    }
  }, [chainConfigs]);

  return tronWeb;
}
