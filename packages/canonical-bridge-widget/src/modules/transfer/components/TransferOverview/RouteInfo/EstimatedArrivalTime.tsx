import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';
import { useMemo } from 'react';
import { Box, Flex, FlexProps, useColorMode, useIntl, useTheme } from '@bnb-chain/space';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { formatEstimatedTime } from '@/core/utils/time';
import { TimerIcon } from '@/core/components/icons/TimerIcon';
import { useStargateWaitTime } from '@/modules/aggregator/adapters/stargate/hooks/useStargateWaitTime';
import { useCBridgeTransferWaitingTime } from '@/modules/aggregator/adapters/cBridge/hooks/useCBridgeTransferWaitingTime';

interface EstimatedArrivalTimeProps {
  bridgeType?: BridgeType;
}
export const EstimatedArrivalTime = ({
  bridgeType,
  ...otherProps
}: FlexProps & EstimatedArrivalTimeProps) => {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();

  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);

  const { data: estimatedTime } = useStargateWaitTime();
  const { data: time } = useCBridgeTransferWaitingTime({
    srcChainId: fromChain?.id,
    dstChainId: toChain?.id,
    isEnabled: bridgeType === 'cBridge',
  });

  const waitingTime = useMemo(() => {
    return bridgeType === 'cBridge'
      ? time?.median_transfer_latency_in_second
      : bridgeType === 'deBridge'
      ? estimatedAmount?.['deBridge']?.order?.approximateFulfillmentDelay
      : bridgeType === 'stargate' && estimatedTime?.avgWaitTime
      ? estimatedTime?.avgWaitTime / 1000
      : null;
  }, [bridgeType, time, estimatedAmount, estimatedTime]);

  return waitingTime ? (
    <Flex
      gap={'4px'}
      flexDir={'row'}
      alignItems={'center'}
      color={theme.colors[colorMode].text.tertiary}
      lineHeight={'16px'}
      {...otherProps}
    >
      <TimerIcon w={'16px'} h={'16px'} />
      <Box fontSize={['14px']} fontWeight={400}>
        {formatMessage({ id: 'route.time.title' })}
      </Box>
      {waitingTime ? (
        <Box fontSize={'14px'} fontWeight={500}>
          ~{formatEstimatedTime(waitingTime)}
        </Box>
      ) : (
        '--'
      )}
    </Flex>
  ) : null;
};
