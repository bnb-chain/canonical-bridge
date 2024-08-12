import { BridgeChain, BridgeToken } from '../types';

export function isAvailableChainOrToken(data?: BridgeToken | BridgeChain) {
  return data && Object.values(data.available).some((item) => item);
}
