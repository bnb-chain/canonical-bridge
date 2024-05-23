import { DeBridgeSupportedChainsInfo } from '@/bridges/debridge/types';
import { useQuery } from '@tanstack/react-query';
import { getDeBridgeSupportedChainInfo } from '@/bridges/debridge/api';

export const useFetchDeBridgeSupportedChainsInfo = ({
  initProps,
}: {
  initProps: DeBridgeSupportedChainsInfo;
}) => {
  return useQuery<DeBridgeSupportedChainsInfo>({
    queryKey: ['supported-chains-info'],
    queryFn: getDeBridgeSupportedChainInfo,
    initialData: initProps,
  });
};
