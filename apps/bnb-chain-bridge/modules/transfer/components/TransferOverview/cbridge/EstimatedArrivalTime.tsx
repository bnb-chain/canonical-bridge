import { useAppSelector } from '@/core/store/hooks';
import { formatEstimatedTime } from '@/core/utils/time';
import { useFetchCBridgeTransferWaitingTime } from '@/modules/bridges/cbridge/api/useFetchCBridgeTransferWaitingTime';
import { InfoRow } from '@/modules/transfer/components/InfoRow';

export const EstimatedArrivalTime = () => {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const { data: cBridgeEstimatedWaitTime } = useFetchCBridgeTransferWaitingTime({
    srcChainId: fromChain?.id as number,
    dstChainId: toChain?.id as number,
  });

  return (
    <InfoRow
      label="Est. Time:"
      value={
        !cBridgeEstimatedWaitTime?.err &&
        formatEstimatedTime(cBridgeEstimatedWaitTime?.median_transfer_latency_in_second)
      }
    />
  );
};
