import { ChainType } from '@/aggregator/types';

export function isSameAddress(A?: string, B?: string) {
  if (!A || !B) return false;

  if (isEvmAddress(A) && isEvmAddress(B)) {
    return A.toLowerCase() === B.toLowerCase();
  }

  return A === B;
}

export function isEvmAddress(address?: string) {
  return !!address && /^0x[a-f0-9]{40}$/i.test(address);
}

export function isNativeToken(
  tokenAddress: string,
  chainType: ChainType = 'evm'
) {
  if (chainType === 'solana') {
    return tokenAddress === '11111111111111111111111111111111';
  }

  return tokenAddress === '0x0000000000000000000000000000000000000000';
}

export function isSolanaAddress(address?: string) {
  return !!address && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

export function isTronAddress(address?: string) {
  return !!address && /^T[a-zA-Z0-9]{33}$/.test(address);
}
