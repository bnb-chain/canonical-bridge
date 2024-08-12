import { Chain } from 'viem';

export function getNativeTokenMap(evmConnectData: Chain[]) {
  const nativeTokenMap = new Map<number, string>();

  evmConnectData.forEach((item) => {
    if (item.id && item.nativeCurrency.symbol) {
      nativeTokenMap.set(item.id, item.nativeCurrency.symbol);
    }
  });

  return nativeTokenMap;
}
