import { IBridgeProvider, IBridgeProviderOptions } from '@/adapters/base/types';
import { ICBridgeTransferConfig } from '@/adapters/cBridge/types';

export function cBridge<T = ICBridgeTransferConfig>(
  params: IBridgeProviderOptions<T>
): IBridgeProvider<T> {
  return {
    id: 'cBridge',
    ...params,
  };
}
