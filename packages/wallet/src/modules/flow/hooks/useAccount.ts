import { useFlowWallet } from '@/modules/flow/providers/FlowWalletProvider';

export function useAccount() {
  const { address, isConnected } = useFlowWallet();
  return {
    address,
    isConnected,
  };
}
