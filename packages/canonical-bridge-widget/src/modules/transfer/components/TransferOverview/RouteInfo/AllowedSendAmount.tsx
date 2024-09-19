import { Box, BoxProps, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { useMemo } from 'react';

import { FinanceChip } from '@/core/components/icons/FinanceChip';
import { useAppSelector } from '@/modules/store/StoreProvider';

interface AllowedSendAmountProps {
  isError?: boolean;
  allowedSendAmount?: { min: string; max: string } | null;
}

export const AllowedSendAmount = ({
  isError,
  allowedSendAmount,
  ...otherProps
}: BoxProps & AllowedSendAmountProps) => {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();

  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  const allowedSendAmt = useMemo(() => {
    return allowedSendAmount
      ? `${allowedSendAmount.min} - ${allowedSendAmount.max} ${selectedToken?.symbol}`
      : null;
  }, [selectedToken, allowedSendAmount]);

  return allowedSendAmt ? (
    <Box
      gap={'4px'}
      flexDir={'row'}
      alignItems={'center'}
      color={!isError ? theme.colors[colorMode].text.tertiary : theme.colors[colorMode].text.danger}
      lineHeight={'16px'}
      {...otherProps}
    >
      <FinanceChip w={'16px'} h={'16px'} />
      <Box ml={'4px'} display={'inline'} fontSize={'16px'} fontWeight={400}>
        {formatMessage({ id: 'route.allowed-send-amount' })}
      </Box>
      <Box ml={'4px'} display={'inline'} fontSize={'14px'} fontWeight={500}>
        {allowedSendAmt}
      </Box>
    </Box>
  ) : null;
};
