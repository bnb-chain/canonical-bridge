export function isSameAddress(A?: string, B?: string) {
  if (isEvmAddress(A) && isEvmAddress(B)) {
    return A?.toLowerCase() === B?.toLowerCase();
  }

  return false;
}

export function isEvmAddress(address?: string) {
  return !!address && /^0x[a-f0-9]{40}$/i.test(address);
}

export function isSolanaAddress(address?: string) {
  return !!address && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

export function isTronAddress(address?: string) {
  return !!address && /^T[a-zA-Z0-9]{33}$/.test(address);
}

export const isValidTokenAddress = ({
  tokenAddress,
  chainType,
  isSourceChain,
}: {
  tokenAddress: string;
  chainType: string;
  isSourceChain: boolean;
}) => {
  const fromOrTo = isSourceChain ? 'from' : 'to';
  if (chainType === 'evm') {
    if (!isEvmAddress(tokenAddress)) {
      console.log(
        `Invalid evm ${fromOrTo} token address`,
        chainType,
        tokenAddress
      );
      return false;
    }
  } else if (chainType === 'solana') {
    if (!isSolanaAddress(tokenAddress)) {
      console.log(
        `Invalid solana ${fromOrTo} token address`,
        chainType,
        tokenAddress
      );
      return false;
    }
  } else {
    console.log(`Invalid ${fromOrTo} chain type`, chainType, tokenAddress);
    return false;
  }
  return true;
};
