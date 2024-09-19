import { IBridgeChain, IBridgeToken } from '../types';

export function isChainOrTokenCompatible(data?: IBridgeToken | IBridgeChain) {
  return data && Object.values(data).some((item) => typeof item === 'object' && item.isCompatible);
}
