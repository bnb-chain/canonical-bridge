import { useTronAccount } from '@/modules/wallet/hooks/useTronAccount';

export function useTronTokenBalance(tokenAddress?: string) {
  const { address } = useTronAccount();

  return null;
}
