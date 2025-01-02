import {
  IBridgeProviderOptions,
  IBridgeProvider,
  IDeBridgeTransferConfig,
} from '@/modules/aggregator';

export function deBridge<T = IDeBridgeTransferConfig>(
  params: IBridgeProviderOptions<T>,
): IBridgeProvider<T> {
  return {
    id: 'deBridge',
    ...params,
  };
}
