import { useQuery } from '@tanstack/react-query';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { IStarGateBusDriveSettings } from '@/modules/bridges/stargate/types';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { bridgeSDK } from '@/core/constants/bridgeSDK';

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
      return await bridgeSDK.stargate.getBusQueueTime({
        fromEndpointId: String(fromEndpointId),
        toEndpointId: String(toEndpointId),
      });
    },
    enabled: !!fromEndpointId && !!toEndpointId && isMainnet,
    staleTime: 1000 * 30,
  });
};
