import { BridgeAdapter } from '@/core/types';

export function createBridgeAdapter<T = any, P = any>(
  params: BridgeAdapter<T, P>
) {
  return params;
}
