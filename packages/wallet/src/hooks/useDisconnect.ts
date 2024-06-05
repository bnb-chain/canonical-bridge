import { useWallet } from '@/providers/WalletProvider';
import { useDisconnect as useEVMDisconnect } from 'wagmi';
import { useDisconnect as useFlowDisconnect } from '@/modules/flow/hooks/useDisconnect';

export function useDisconnect() {
  const { walletType } = useWallet();

  const evmDisconnect = useEVMDisconnect();
  const flowDisconnect = useFlowDisconnect();

  return {
    disconnect: () => {
      if (walletType === 'evm') evmDisconnect.disconnect();
      if (walletType === 'flow') flowDisconnect.disconnect();
    },
  };
}
