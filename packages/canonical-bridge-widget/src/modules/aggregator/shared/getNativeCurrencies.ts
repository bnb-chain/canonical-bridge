import { IChainConfig, INativeCurrency } from '@/modules/aggregator/types';

export function getNativeCurrencies(chainConfigs: IChainConfig[]) {
  const nativeCurrencies: Record<number, INativeCurrency> = {};

  chainConfigs.forEach((item) => {
    if (item.id && item.nativeCurrency) {
      nativeCurrencies[item.id] = item.nativeCurrency;
    }
  });

  return nativeCurrencies;
}
