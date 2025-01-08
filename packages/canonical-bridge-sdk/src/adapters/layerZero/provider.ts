import { ILayerZeroConfig } from '@/adapters/layerZero/types';
import { IBridgeProvider, IBridgeProviderOptions } from '@/adapters/base/types';

export function layerZero<T = ILayerZeroConfig>(
  params: IBridgeProviderOptions<T>
): IBridgeProvider<T> {
  return {
    id: 'layerZero',
    ...params,
  };
}
