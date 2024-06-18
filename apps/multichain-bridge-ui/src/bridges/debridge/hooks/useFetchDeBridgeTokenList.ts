import { DeBridgeTokenList } from '@/bridges/debridge/types';
import { useQuery } from '@tanstack/react-query';
import { getDeBridgeTokenList } from '@/bridges/debridge/api/getDeBridgeTokenList';

export const useFetchDeBridgeTokenList = (chainId: number) => {
  return useQuery<DeBridgeTokenList>({
    queryKey: ['debridge-token-list', chainId],
    queryFn: async () => {
      return getDeBridgeTokenList(chainId);
    },
  });
};
