import { BridgeConfigContext } from '@/providers/BridgeConfigProvider';
import { useContext } from 'react';

export function useBridgeConfig() {
  return useContext(BridgeConfigContext);
}
