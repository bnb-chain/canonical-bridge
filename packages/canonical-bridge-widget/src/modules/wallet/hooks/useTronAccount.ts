import { useContext } from 'react';

import { TronAccountContext } from '@/modules/wallet/TronAccountProvider';

export function useTronAccount() {
  return useContext(TronAccountContext);
}
