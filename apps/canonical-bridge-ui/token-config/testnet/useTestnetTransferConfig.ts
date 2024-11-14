import { useEffect, useState } from 'react';
import { ITransferConfig } from '@bnb-chain/canonical-bridge-widget';

import mesonConfigTestnet from '@/token-config/testnet/meson/config.json';

export function useTestnetTransferConfig() {
  const [transferConfig, setTransferConfig] = useState<ITransferConfig>();

  useEffect(() => {
    const initConfig = async () => {
      const transferConfig: ITransferConfig = {
        defaultSelectedInfo: {
          fromChainId: 97,
          toChainId: 3448148188,
          tokenAddress: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd', // USDT
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
