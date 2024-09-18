import { useAppSelector } from '@/modules/store/StoreProvider';
import { formatEstimatedTime } from '@/core/utils/time';
import { InfoRow } from '@/modules/transfer/components/InfoRow';
import { useFetchCBridgeTransferWaitingTime } from '@/modules/aggregator/adapters/cBridge/api/useFetchCBridgeTransferWaitingTime';

export const EstimatedArrivalTime = () => {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const { time } = useFetchCBridgeTransferWaitingTime({
    srcChainId: fromChain?.id as number,
    dstChainId: toChain?.id as number,
  });

  return <InfoRow label="Est. Time:" value={!!time && formatEstimatedTime(time)} />;
};
