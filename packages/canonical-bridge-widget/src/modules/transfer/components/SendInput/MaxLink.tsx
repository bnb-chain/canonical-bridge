import { Box, Flex, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setSendValue } from '@/modules/transfer/action';
import { formatNumber } from '@/core/utils/number';
import { useLoadingTokenBalance } from '@/modules/transfer/hooks/useLoadingTokenBalance';
import { useTokenPrice } from '@/modules/aggregator/components/TokenPricesProvider';

export const MaxLink: React.FC = () => {
  const theme = useTheme();
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const dispatch = useAppDispatch();
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();
  const { balance } = useLoadingTokenBalance();
  const { chain } = useAccount();
  const { getTokenPrice } = useTokenPrice();
  const [tokenPrice, setTokenPrice] = useState<number | undefined>(undefined);

  const setMaxAmount = () => {
    if (!!balance && selectedToken) {
      dispatch(setSendValue(formatUnits(balance, selectedToken?.decimals || 0)));
    }
  };

  useEffect(() => {
    if (selectedToken) {
      const price = getTokenPrice(selectedToken);
      setTokenPrice(price);
    }
    return () => {
      setTokenPrice(undefined);
    };
  }, [getTokenPrice, selectedToken]);

  return (
    <Flex alignItems={'center'}>
      {balance !== null && !!selectedToken && fromChain?.id === chain?.id ? (
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
          {selectedToken?.symbol}
          {tokenPrice &&
            ` ($${formatNumber(
              tokenPrice * Number(formatUnits(balance, selectedToken?.decimals || 0)),
              2,
            )})`}
        </Box>
      ) : null}
    </Flex>
  );
};
