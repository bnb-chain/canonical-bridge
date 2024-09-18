import { isSameAddress } from '@/core/utils/address';

export function getDisplayTokenSymbol({
  symbolMap = {},
  defaultSymbol,
  tokenAddress,
}: {
  symbolMap: Record<string, string>;
  defaultSymbol: string;
  tokenAddress: string;
}) {
  const target = Object.entries(symbolMap).find(([address]) =>
    isSameAddress(address, tokenAddress),
  );

  return target?.[1] ?? defaultSymbol;
}
