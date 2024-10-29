import { PropsWithChildren } from 'react';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { WalletConnectButton } from '@/modules/transfer/components/Button/WalletConnectButton';
import { SwitchNetworkButton } from '@/modules/transfer/components/Button/SwitchNetworkButton';
import { useCurrentWallet } from '@/modules/wallet/CurrentWalletProvider';
import { SwitchWalletButton } from '@/modules/transfer/components/Button/SwitchWalletButton';
import { useDebounce } from '@/core/hooks/useDebounce.ts';

export function WalletButtonWrapper(props: PropsWithChildren) {
  const { children } = props;

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const { isConnected, chainId, walletType } = useCurrentWallet();

  const { _chainId, _fromChainId, _isConnected, _walletType, _fromChainType } = useDebounce(
    {
      _chainId: chainId,
      _fromChainId: fromChain?.id,
      _isConnected: isConnected,
      _walletType: walletType,
      _fromChainType: fromChain?.chainType,
    },
    100,
  );

  if (_isConnected) {
    if (_walletType !== _fromChainType) {
      return <SwitchWalletButton />;
    } else {
      if (_chainId !== _fromChainId) {
        return <SwitchNetworkButton />;
      }
      return <>{children}</>;
    }
  }

  return <WalletConnectButton />;
}
