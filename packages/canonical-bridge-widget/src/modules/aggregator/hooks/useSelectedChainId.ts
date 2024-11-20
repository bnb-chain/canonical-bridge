import { useAccount } from 'wagmi';

import { useSolanaAccount } from '@/modules/wallet/hooks/useSolanaAccount';
import { useTronAccount } from '@/modules/wallet/hooks/useTronAccount';

export function useSelectedChainId() {
  const { chainId: evmChainId } = useAccount();
  const { chainId: solanaChainId } = useSolanaAccount();
  const { chainId: tronChainId } = useTronAccount();

  return evmChainId || solanaChainId || tronChainId;
}
