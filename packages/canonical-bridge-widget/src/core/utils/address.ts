import { truncateHash } from '@/core/utils/string';

export function formatAppAddress(params: {
  address?: string;
  transform?: 'lowerCase' | 'upperCase';
  isTruncated?: boolean;
  headLen?: number;
  tailLen?: number;
}) {
  const { address, transform, isTruncated = true, headLen, tailLen } = params;
  if (!address) {
    return '';
  }

  if (isEvmAddress(address)) {
    let finalAddress = address;
    if (transform === 'lowerCase') {
      finalAddress = address.toLowerCase();
    }
    if (transform === 'upperCase') {
      finalAddress = `0x${address.replace('0x', '').toUpperCase()}`;
    }

    if (isTruncated) {
      return truncateHash(finalAddress, headLen ?? 6, tailLen ?? 4);
    }

    return finalAddress;
  }

  if (isTruncated) {
    return truncateHash(address, headLen ?? 4, tailLen ?? 4);
  }

  return address;
}

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