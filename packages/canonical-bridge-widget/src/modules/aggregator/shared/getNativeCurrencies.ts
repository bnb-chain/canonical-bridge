import { IChainConfig, INativeCurrency } from '@/modules/aggregator/types';

export function getNativeCurrencies(chainConfigs: IChainConfig[]) {
  const nativeCurrencies: Record<number | string, INativeCurrency> = {};

  chainConfigs.forEach((chain) => {
    if (chain.id && chain.nativeCurrency) {
      nativeCurrencies[chain.id] = chain.nativeCurrency;
    }
  });

  return nativeCurrencies;
}
