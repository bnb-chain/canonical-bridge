import { InfoRow } from '@/app/transfer/components/InfoRow';
import { useCBridgeSendMaxMin } from '@/bridges/cbridge/hooks';
import { useCBridgeTransferParams } from '@/bridges/cbridge/hooks/useCBridgeTransferParams';
import { useAppSelector } from '@/store/hooks';
import { formatUnits } from 'viem';

export const AllowAmountRange = ({ isLoading }: { isLoading?: boolean }) => {
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const { bridgeAddress } = useCBridgeTransferParams();

  const { minMaxSendAmt } = useCBridgeSendMaxMin({
    bridgeAddress: bridgeAddress as `0x${string}`,
    tokenAddress: selectedToken?.address as `0x${string}`,
  });

  return (
    <InfoRow
      isLoading={isLoading}
      label="Allow Range:"
      value={
        minMaxSendAmt &&
        minMaxSendAmt?.[0]?.result &&
        minMaxSendAmt?.[1]?.result &&
        selectedToken
          ? `${formatUnits(
              minMaxSendAmt?.[0]?.result,
              selectedToken?.decimal
            )} ${selectedToken.symbol} - ${formatUnits(
              minMaxSendAmt?.[1]?.result,
              selectedToken?.decimal
            )} ${selectedToken.symbol}`
          : '-'
      }
    />
  );
};
