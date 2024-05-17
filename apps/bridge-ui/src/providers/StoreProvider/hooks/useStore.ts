import { StoreContext } from '@/providers/StoreProvider';
import { useContext } from 'react';

export function useStore() {
  return useContext(StoreContext);
}
