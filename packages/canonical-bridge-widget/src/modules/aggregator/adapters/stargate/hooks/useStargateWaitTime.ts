import { useQuery } from '@tanstack/react-query';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { IStargateBusDriveSettings } from '@/modules/aggregator/adapters/stargate/types';
import { useBridgeSDK } from '@/core/hooks/useBridgeSDK';

export const useStargateWaitTime = () => {
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const { toTokenInfo } = useToTokenInfo();
  const bridgeSDK = useBridgeSDK();

  const fromEndpointId = selectedToken?.stargate?.raw?.endpointID;
  const toEndpointId = toTokenInfo?.stargate?.raw?.endpointID;
  const isMainnet =
    fromEndpointId?.toString().startsWith('30') && toEndpointId?.toString().startsWith('30');
  return useQuery<IStargateBusDriveSettings>({
    queryKey: ['stargate-bus-wait-time', fromEndpointId, toEndpointId],
    queryFn: async () => {
      return await bridgeSDK.stargate!.getBusQueueTime({
        fromEndpointId: String(fromEndpointId),
        toEndpointId: String(toEndpointId),
      });
    },
    enabled: !!fromEndpointId && !!toEndpointId && isMainnet,
    staleTime: 1000 * 30,
  });
};
