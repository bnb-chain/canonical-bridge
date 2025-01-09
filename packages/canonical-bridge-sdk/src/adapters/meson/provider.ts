import { IMesonTransferConfig } from '@/adapters/meson/types';
import { IBridgeProvider, IBridgeProviderOptions } from '@/adapters/base/types';

export function meson<T = IMesonTransferConfig>(
  params: IBridgeProviderOptions<T>
): IBridgeProvider<T> {
  return {
    id: 'meson',
    ...params,
  };
}
