import {
  IBridgeProviderOptions,
  IBridgeProvider,
  ICBridgeTransferConfig,
} from '@/modules/aggregator';

export function cBridge<T = ICBridgeTransferConfig>(
  params: IBridgeProviderOptions<T>,
): IBridgeProvider<T> {
  return {
    id: 'cBridge',
    ...params,
  };
}
