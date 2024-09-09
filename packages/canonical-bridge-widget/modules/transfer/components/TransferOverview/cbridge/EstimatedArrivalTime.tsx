import { useAppSelector } from '@/core/store/hooks';
import { formatEstimatedTime } from '@/core/utils/time';
import { useFetchCBridgeTransferWaitingTime } from '@/modules/bridges/cbridge/api/useFetchCBridgeTransferWaitingTime';
import { InfoRow } from '@/modules/transfer/components/InfoRow';

export const EstimatedArrivalTime = () => {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const { time } = useFetchCBridgeTransferWaitingTime({
    srcChainId: fromChain?.id as number,
    dstChainId: toChain?.id as number,
  });

  return <InfoRow label="Est. Time:" value={!!time && formatEstimatedTime(time)} />;
};
