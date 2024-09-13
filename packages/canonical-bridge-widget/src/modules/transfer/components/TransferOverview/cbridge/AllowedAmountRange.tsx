import { formatUnits } from 'viem';
import { useIntl } from '@bnb-chain/space';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useCBridgeSendMaxMin } from '@/modules/bridges/cbridge/hooks';
import { InfoRow } from '@/modules/transfer/components/InfoRow';

export const AllowAmountRange = ({ isLoading }: { isLoading?: boolean }) => {
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const { formatMessage } = useIntl();

  const { minMaxSendAmt } = useCBridgeSendMaxMin();

  return !selectedToken?.isPegged ? (
    <InfoRow
      isLoading={isLoading}
      label={formatMessage({ id: 'route.option.info.send-range' })}
      value={
        minMaxSendAmt && !!Number(minMaxSendAmt.min) && !!Number(minMaxSendAmt.max) && selectedToken
          ? `${formatUnits(BigInt(minMaxSendAmt.min), selectedToken?.decimal)} - ${formatUnits(
              BigInt(minMaxSendAmt.max),
              selectedToken?.decimal,
            )} ${selectedToken.symbol}`
          : '-'
      }
    />
  ) : null;
};
