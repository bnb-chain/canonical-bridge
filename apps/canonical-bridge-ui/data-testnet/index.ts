import { useEffect, useState } from 'react';
import { ITransferConfig } from '@bnb-chain/canonical-bridge-widget';

import mesonConfigTestnet from '@/data-testnet/meson/config.json';

export function useTestnetTransferConfig() {
  const [transferConfig, setTransferConfig] = useState<ITransferConfig>();

  useEffect(() => {
    const initConfig = async () => {
      const transferConfig: ITransferConfig = {
        defaultSelectedInfo: {
          fromChainId: 97,
          toChainId: 728126427,
          tokenSymbol: 'USDT', // USDT
          amount: '',
        },
        order: {
          chains: [],
          tokens: ['USDC', 'USDT'],
        },
        displayTokenSymbols: {},
        meson: {
          config: mesonConfigTestnet.result as any,
          exclude: {
            chains: [],
            tokens: {},
          },
          bridgedTokenGroups: [],
        },
      };

      setTransferConfig(transferConfig);
    };

    initConfig();
  }, []);

  return transferConfig;
}
