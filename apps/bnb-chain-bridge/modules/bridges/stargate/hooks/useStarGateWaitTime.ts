import { useQuery } from '@tanstack/react-query';

import { useAppSelector } from '@/core/store/hooks';
import { IStarGateBusDriveSettings } from '@/modules/bridges/stargate/types';
import { stargateApiClient } from '@/modules/bridges/stargate/client';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';

export const useStarGateWaitTime = () => {
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const { toTokenInfo } = useToTokenInfo();

  const fromEndpointId = selectedToken?.rawData.stargate?.endpointID;
  const toEndpointId = toTokenInfo?.rawData.stargate?.endpointID;
  const isMainnet =
    fromEndpointId?.toString().startsWith('30') && toEndpointId?.toString().startsWith('30');
  return useQuery<IStarGateBusDriveSettings>({
    queryKey: ['stargate-bus-wait-time', fromEndpointId, toEndpointId],
    queryFn: async () => {
      return (await stargateApiClient.get(`${fromEndpointId}/${toEndpointId}`)).data;
    },
    enabled: !!fromEndpointId && !!toEndpointId && isMainnet,
    staleTime: 1000 * 30,
  });
};
