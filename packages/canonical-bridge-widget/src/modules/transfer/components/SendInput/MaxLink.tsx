import { Box, Flex, useColorMode, useIntl, useTheme } from '@bnb-chain/space';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setSendValue } from '@/modules/transfer/action';
import { formatNumber } from '@/core/utils/number';
import { useTokenBalance } from '@/modules/aggregator/providers/TokenBalancesProvider';
import { useTokenPrice } from '@/modules/aggregator/providers/TokenPricesProvider';
import { EventTypes, useAnalytics } from '@/core/analytics';

export const MaxLink: React.FC = () => {
  const theme = useTheme();
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const { emit } = useAnalytics();

  const dispatch = useAppDispatch();
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();

  const { getTokenBalance } = useTokenBalance();
  const { getTokenPrice } = useTokenPrice();

  const balance = getTokenBalance(selectedToken);
  const tokenPrice = getTokenPrice({
    chainId: fromChain?.id,
    chainType: fromChain?.chainType,
    tokenAddress: selectedToken?.address,
    tokenSymbol: selectedToken?.symbol,
  });

  const setMaxAmount = () => {
    if (!!balance && selectedToken) {
      const value = balance.toString();
      dispatch(setSendValue(value));
      emit(EventTypes.CLICK_BRIDGE_MAX, {
        networkName: fromChain?.name || '',
        item_name: fromChain?.name || '',
        token: selectedToken.displaySymbol,
        value,
        tokenAddress: selectedToken.address,
      });
    }
  };

  const showBalance = balance !== undefined && !!selectedToken;

  return (
    <Flex className="bccb-widget-transfer-max" alignItems={'center'}>
      {showBalance ? (
        <Box
          className="max-text"
          onClick={setMaxAmount}
          color={theme.colors[colorMode].text.tertiary}
          textDecoration={'underline'}
          textUnderlineOffset={'2px'}
          cursor={!!balance ? 'pointer' : 'auto'}
          fontSize={'12px'}
          fontWeight={500}
          lineHeight={'16px'}
          transitionDuration="normal"
          sx={{
            '@media (hover:hover)': {
              _hover: {
                color: !!balance
                  ? theme.colors[colorMode].text.primary
                  : theme.colors[colorMode].text.tertiary,
              },
            },
          }}
        >
          {formatMessage({ id: 'from.section.balance.button.max' })}{' '}
          {formatNumber(Number(balance) || 0, 8)} {selectedToken?.displaySymbol}
          {tokenPrice && ` ($${formatNumber(tokenPrice * Number(balance || 0), 2)})`}
        </Box>
      ) : null}
    </Flex>
  );
};
