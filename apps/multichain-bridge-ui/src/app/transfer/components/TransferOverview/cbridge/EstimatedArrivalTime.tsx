import { InfoRow } from '@/app/transfer/components/InfoRow';
import { useFetchCBridgeTransferWaitingTime } from '@/bridges/cbridge/api/useFetchCBridgeTransferWaitingTime';
import { useAppSelector } from '@/store/hooks';

export const EstimatedArrivalTime = () => {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const { data: cBridgeEstimatedWaitTime } = useFetchCBridgeTransferWaitingTime(
    {
      srcChainId: fromChain?.id as number,
      dstChainId: toChain?.id as number,
    }
  );

  return (
    <InfoRow
      label="Estimated Arrival Time:"
      value={
        !cBridgeEstimatedWaitTime?.err &&
        cBridgeEstimatedWaitTime?.median_transfer_latency_in_second
          ? String(
              cBridgeEstimatedWaitTime?.median_transfer_latency_in_second
            ).split('.')[0] + 's'
          : '-'
      }
    />
  );
};
