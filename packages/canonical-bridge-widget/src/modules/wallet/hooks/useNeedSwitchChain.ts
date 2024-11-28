import { useAccount } from 'wagmi';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useTronAccount } from '@/modules/wallet/hooks/useTronAccount';

export function useNeedSwitchChain() {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const evmAccount = useAccount();
  const tronAccount = useTronAccount();

  const evmNeedSwitchChain =
    fromChain?.chainType === 'evm' && evmAccount.isConnected && fromChain.id !== evmAccount.chainId;

  const tronNeedSwitchChain =
    fromChain?.chainType === 'tron' &&
    tronAccount.isConnected &&
    fromChain.id !== tronAccount.chainId;

  const solanaNeedSwitchChain = false;

  const needSwitchChain = evmNeedSwitchChain || tronNeedSwitchChain || solanaNeedSwitchChain;

  return {
    evmNeedSwitchChain,
    tronNeedSwitchChain,
    solanaNeedSwitchChain,
    needSwitchChain,
  };
}
