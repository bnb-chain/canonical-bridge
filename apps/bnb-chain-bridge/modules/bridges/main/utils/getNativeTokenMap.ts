import { ChainConfig } from '@/modules/bridges';

export function getNativeTokenMap(chainConfigs: ChainConfig[]) {
  const nativeTokenMap = new Map<number, ChainConfig['nativeCurrency']>();

  chainConfigs.forEach((item) => {
    if (item.id && item.nativeCurrency.symbol) {
      nativeTokenMap.set(item.id, item.nativeCurrency);
    }
  });

  return nativeTokenMap;
}
