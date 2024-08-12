import { Chain } from 'viem';

import { ssrApiClient } from '@/core/utils/client';

export async function getEvmConnectData() {
  return (await ssrApiClient.get<Chain[]>(`api/getEvmConnectData`)).data;
}
