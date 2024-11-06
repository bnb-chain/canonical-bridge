import { Box, BoxProps, Flex, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { InfoCircleIcon } from '@bnb-chain/icons';

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

  return allowedSendAmount && isError ? (
    <Flex
      flexDir={'row'}
      alignItems={'center'}
      color={
        !isError ? theme.colors[colorMode].text.tertiary : theme.colors[colorMode].route.warning
      }
      lineHeight={'16px'}
      display={'inline-block'}
      sx={{
        '>svg': {
          verticalAlign: '-3px',
        },
      }}
      {...otherProps}
    >
      <InfoCircleIcon display={'inline'} w={'16px'} h={'16px'} />
      <Box ml={'4px'} display={'inline'} fontSize={'14px'} fontWeight={400}>
        {formatMessage(
          { id: 'route.allowed-send-amount' },
          { symbol: selectedToken?.symbol, min: allowedSendAmount.min, max: allowedSendAmount.max },
        )}
      </Box>
    </Flex>
  ) : null;
};
