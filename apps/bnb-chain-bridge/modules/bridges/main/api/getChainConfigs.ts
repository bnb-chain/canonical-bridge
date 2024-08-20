import { ssrApiClient } from '@/core/utils/client';
import { ChainConfig } from '@/modules/bridges/main/types';

export async function getChainConfigs() {
  return (await ssrApiClient.get<ChainConfig[]>(`api/getChainConfigs`)).data;
}
