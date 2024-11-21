import { useContext } from 'react';

import { TronAccountContext, TronAccountContextProps } from '@/modules/wallet/TronAccountProvider';

export function useTronAccount(): TronAccountContextProps {
  return useContext(TronAccountContext);
}
