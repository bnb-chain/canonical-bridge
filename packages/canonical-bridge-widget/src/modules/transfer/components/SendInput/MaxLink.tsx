import { Box, Flex, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { formatUnits } from 'viem';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setSendValue } from '@/modules/transfer/action';
import { formatNumber } from '@/core/utils/number';
import { useLoadingTokenBalance } from '@/modules/transfer/hooks/useLoadingTokenBalance';

export const MaxLink: React.FC = () => {
  const theme = useTheme();
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  const dispatch = useAppDispatch();
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();
  const { balance } = useLoadingTokenBalance();

  const setMaxAmount = () => {
    if (!!balance && selectedToken) {
      dispatch(setSendValue(formatUnits(balance, selectedToken?.decimals || 0)));
    }
  };

  return (
    <Flex alignItems={'center'}>
      {balance !== null && !!selectedToken ? (
        <Box
          onClick={setMaxAmount}
          color={theme.colors[colorMode].text.tertiary}
          textDecoration={'underline'}
          cursor={!!balance ? 'pointer' : 'auto'}
          fontSize={'12px'}
          fontWeight={500}
          pb={`1px`}
          _hover={{
            color: !!balance
              ? theme.colors[colorMode].text.primary
              : theme.colors[colorMode].text.tertiary,
          }}
        >
          {formatMessage({ id: 'from.section.balance.button.max' })}{' '}
          {formatNumber(Number(formatUnits(balance, selectedToken?.decimals || 0)), 8)}{' '}
          {/* TODO: Token dollars */}
          {selectedToken?.symbol}
          {/* ({'$0xxxxx.xx'}) */}
        </Box>
      ) : null}
    </Flex>
  );
};
