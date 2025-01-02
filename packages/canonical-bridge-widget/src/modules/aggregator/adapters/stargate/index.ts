import {
  IBridgeProviderOptions,
  IBridgeProvider,
  IStargateApiTokenConfig,
} from '@/modules/aggregator';

export function stargate<T = IStargateApiTokenConfig[]>(
  params: IBridgeProviderOptions<T>,
): IBridgeProvider<T> {
  return {
    id: 'stargate',
    ...params,
  };
}
