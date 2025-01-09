import { IStargateTransferConfig } from '@/adapters/stargate/types';
import { IBridgeProvider, IBridgeProviderOptions } from '@/adapters/base/types';

export function stargate<T = IStargateTransferConfig>(
  params: IBridgeProviderOptions<T>
): IBridgeProvider<T> {
  return {
    id: 'stargate',
    enabled: true,
    ...params,
  };
}
