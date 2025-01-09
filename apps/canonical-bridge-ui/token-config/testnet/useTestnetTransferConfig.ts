import { useEffect, useState } from 'react';
import { ICustomizedBridgeConfig, meson } from '@bnb-chain/canonical-bridge-widget';

import mesonConfigTestnet from '@/token-config/testnet/meson/config.json';

export function useTestnetTransferConfig() {
  const [transferConfig, setTransferConfig] = useState<ICustomizedBridgeConfig['transfer']>();

  useEffect(() => {
    const initConfig = async () => {
      const transferConfig: ICustomizedBridgeConfig['transfer'] = {
        defaultFromChainId: 97,
        defaultToChainId: 3448148188,
        defaultTokenAddress: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
        defaultAmount: '',
        providers: [
          meson({
            config: mesonConfigTestnet.result,
            excludedChains: [],
            excludedTokens: [],
          }),
        ],
      };

      setTransferConfig(transferConfig);
    };

    initConfig();
  }, []);

  return transferConfig;
}
