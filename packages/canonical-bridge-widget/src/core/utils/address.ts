import { isEvmAddress } from '@bnb-chain/canonical-bridge-sdk';

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
