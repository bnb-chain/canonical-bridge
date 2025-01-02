import { IBridgeProviderOptions, IBridgeProvider, IMesonTokenList } from '@/modules/aggregator';

export function meson<T = IMesonTokenList>(params: IBridgeProviderOptions<T>): IBridgeProvider<T> {
  return {
    id: 'meson',
    ...params,
  };
}
