import { NativeCurrency } from '@bnb-chain/canonical-bridge-sdk';

import { ChainConfig } from '@/modules/bridges';

export function getNativeCurrencies(chainConfigs: ChainConfig[]) {
  const NativeCurrencies: Record<number, NativeCurrency> = {};

  chainConfigs.forEach((item) => {
    if (item.id && item.nativeCurrency.symbol) {
      NativeCurrencies[item.id] = item.nativeCurrency;
    }
  });

  return NativeCurrencies;
}
