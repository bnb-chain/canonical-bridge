import { useWallet } from '@/providers/WalletProvider';
import { useAccount as useEVMAccount } from 'wagmi';
import { useAccount as useFlowAccount } from '@/modules/flow/hooks/useAccount';
import { useMemo } from 'react';

export function useAccount() {
  const { walletType } = useWallet();

  const evm = useEVMAccount();
  const flow = useFlowAccount();

  const result = useMemo(() => {
    if (walletType === 'evm') {
      return {
        address: evm.address,
        isConnected: evm.isConnected,
      };
    }
    if (walletType === 'flow') {
      return {
        address: flow.address,
        isConnected: flow.isConnected,
      };
    }

    return {
      address: null,
      isConnected: false,
    };
  }, [evm, flow.address, flow.isConnected, walletType]);

  return result;
}
