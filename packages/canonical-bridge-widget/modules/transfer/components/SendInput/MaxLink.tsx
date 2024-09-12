import { Box, Flex, useColorMode, useIntl } from '@bnb-chain/space';
import { formatUnits } from 'viem';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setSendValue } from '@/modules/transfer/action';
import { formatNumber } from '@/core/utils/number';
import { useLoadingTokenBalance } from '@/modules/transfer/hooks/useLoadingTokenBalance';

export const MaxLink: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.themeConfig);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  const dispatch = useAppDispatch();
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();
  const { balance } = useLoadingTokenBalance();

  const setMaxAmount = () => {
    if (balance && selectedToken) {
      dispatch(setSendValue(formatUnits(balance, selectedToken?.decimal || 0)));
    }
  };

  return (
    <Flex alignItems={'center'}>
      {!!balance && !!selectedToken ? (
        <Box
          onClick={setMaxAmount}
          color={theme.colors[colorMode].text.tertiary}
          textDecoration={'underline'}
          cursor={'pointer'}
          fontSize={'12px'}
          fontWeight={500}
          pb={`1px`}
          _hover={{ color: theme.colors[colorMode].text.primary }}
        >
          {formatMessage({ id: 'from.section.balance.button.max' })}{' '}
          {formatNumber(Number(formatUnits(balance, selectedToken?.decimal || 0)), 8)}{' '}
          {/* TODO: Token dollars */}
          {selectedToken?.symbol} ({'$0xxxxx.xx'})
        </Box>
      ) : null}
    </Flex>
  );
};
