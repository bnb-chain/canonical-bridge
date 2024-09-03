import { BridgeChain } from '@/modules/bridges';

export function useWalletSupportChain(chain?: BridgeChain, walletId?: string) {
  const supportedWallets: string[] = chain?.supportedWallets ?? [];
  return walletId && supportedWallets.includes(walletId);
}
