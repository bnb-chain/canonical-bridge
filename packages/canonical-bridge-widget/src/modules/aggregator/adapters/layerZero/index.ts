import {
  IBridgeProviderOptions,
  IBridgeProvider,
  ILayerZeroTransferConfig,
} from '@/modules/aggregator';

export function layerZero<T = ILayerZeroTransferConfig>(
  params: IBridgeProviderOptions<T>,
): IBridgeProvider<T> {
  return {
    id: 'layerZero',
    ...params,
  };
}
