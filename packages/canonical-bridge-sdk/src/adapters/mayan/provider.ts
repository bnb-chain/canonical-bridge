import { IMayanTransferConfig } from '@/adapters/mayan/types.ts';
import { IBridgeProvider, IBridgeProviderOptions } from '@/adapters/base/types.ts';

export function mayan<T = IMayanTransferConfig>(
  params: IBridgeProviderOptions<T>
): IBridgeProvider<T> {
  return {
    id: 'mayan',
    ...params
  }
}
