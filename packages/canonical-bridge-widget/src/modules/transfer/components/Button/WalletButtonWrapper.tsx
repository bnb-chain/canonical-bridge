import { PropsWithChildren, useEffect, useMemo, useState } from 'react';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { WalletConnectButton } from '@/modules/transfer/components/Button/WalletConnectButton';
import { SwitchNetworkButton } from '@/modules/transfer/components/Button/SwitchNetworkButton';
import { useCurrentWallet } from '@/modules/wallet/CurrentWalletProvider';
import { SwitchWalletButton } from '@/modules/transfer/components/Button/SwitchWalletButton';
import { useDebounce } from '@/core/hooks/useDebounce';

export function WalletButtonWrapper(props: PropsWithChildren) {
  const { children } = props;

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const { isConnected, chainId, walletType } = useCurrentWallet();
  const [delay, setDelay] = useState(false);

  useEffect(() => {
    setTimeout(() => setDelay(true), 3000);
  }, []);

  const payload = useMemo(() => {
    return {
      _chainId: chainId,
      _fromChainId: fromChain?.id,
      _isConnected: isConnected,
      _walletType: walletType,
      _fromChainType: fromChain?.chainType,
    };
  }, [chainId, fromChain?.id, isConnected, walletType, fromChain?.chainType]);

  const { _chainId, _fromChainId, _isConnected, _walletType, _fromChainType } = useDebounce(
    payload,
    delay ? 1200 : 0,
  );

  if (_isConnected) {
    if (_walletType !== _fromChainType && _fromChainType) {
      return <SwitchWalletButton />;
    } else {
      if (_chainId !== _fromChainId && _fromChainId) {
        return <SwitchNetworkButton />;
      }
      return <>{children}</>;
    }
  }

  return <WalletConnectButton />;
}
