export function isSameAddress(A?: string, B?: string) {
  if (isEvmAddress(A) && isEvmAddress(B)) {
    return A?.toLowerCase() === B?.toLowerCase();
  }

  return false;
}

export function isEvmAddress(address?: string) {
  return !!address && /^0x[a-f0-9]{40}$/i.test(address);
}
