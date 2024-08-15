import { deBridgeStatsApiClient } from '@/src/debridge/client';

// https://stats-api.dln.trade/swagger/index.html
export const getDeBridgeStatsHistory = async (
  address: string,
  pageId = 0,
  pageSize = 20,
  fromChainIds: number[] = [],
  toChainIds: number[] = [],
) => {
  return (
    await deBridgeStatsApiClient.post('/Orders/filteredList', {
      filter: address,
      skip: pageId, // page number
      take: pageSize, // data per page
      giveChainIds: fromChainIds,
      takeChainIds: toChainIds,
    })
  ).data;
};
