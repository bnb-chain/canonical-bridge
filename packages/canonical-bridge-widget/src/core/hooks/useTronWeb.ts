import { useMemo } from 'react';
import { TronWeb } from 'tronweb';

import { useBridgeConfig } from '@/index';

export function useTronWeb() {
  const bridgeConfig = useBridgeConfig();

  const tronWeb = useMemo(() => {
    const tron = bridgeConfig.transfer.chainConfigs.find((e) => e.chainType === 'tron');
    if (tron) {
      return new TronWeb({
        fullHost: tron.rpcUrls.default.http?.[0],
      });
    }
  }, [bridgeConfig.transfer.chainConfigs]);

  return tronWeb;
}
