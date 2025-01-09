import { IDeBridgeTransferConfig } from '@/adapters/deBridge/types';
import { IBridgeProvider, IBridgeProviderOptions } from '@/adapters/base/types';

export function deBridge<T = IDeBridgeTransferConfig>(
  params: IBridgeProviderOptions<T>
): IBridgeProvider<T> {
  return {
    id: 'deBridge',
    enabled: true,
    ...params,
  };
}
