import { IBridgeChain, IBridgeToken } from '../types';

export function isCompatibleChainOrToken(data?: IBridgeToken | IBridgeChain) {
  return data && Object.values(data).some((item) => typeof item === 'object' && item.isCompatible);
}
