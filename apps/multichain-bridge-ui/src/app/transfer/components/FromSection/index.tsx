import {
  setFromChain,
  setSelectedToken,
  setSendValue,
} from '@/app/transfer/action';
import { ChainSelector } from '@/app/transfer/components/ChainSelector';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Box, BoxProps, Flex, Input } from '@node-real/uikit';
import { useGetTokenBalance } from '@/contract/hooks/useGetTokenBalance';
import { formatUnits } from 'viem';
import { useSupportedTokens } from '@/app/transfer/hooks/useSupportedTokens';
import { useSupportedFromChains } from '@/app/transfer/hooks/useSupportedFromChains';
import { ChainInfo, TokenInfo } from '@/bridges/index/types';
import { useEffect } from 'react';
import { TokenSelector } from '@/app/transfer/components/TokenSelector';

const handleKeyPress = (e: React.KeyboardEvent) => {
  // only allow number and decimal
  if (
    e.key !== '1' &&
    e.key !== '2' &&
    e.key !== '3' &&
    e.key !== '4' &&
    e.key !== '5' &&
    e.key !== '6' &&
    e.key !== '7' &&
    e.key !== '8' &&
    e.key !== '9' &&
    e.key !== '0' &&
    e.key !== '.' &&
    e.key !== ',' &&
    e.key !== '。' &&
    e.key !== 'ArrowLeft' &&
    e.key !== 'ArrowRight' &&
    e.key !== 'Backspace'
  ) {
    e.preventDefault();
  }
};

export function FromSection() {
  const dispatch = useAppDispatch();

  const chains = useSupportedFromChains();
  const tokens = useSupportedTokens();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);

  const { balance } = useGetTokenBalance({
    tokenAddress: selectedToken?.address as `0x${string}`,
  });

  useEffect(() => {
    if (fromChain && toChain) {
      dispatch(setSelectedToken(tokens[0]));
      // dispatch(
      //   setSelectedToken(tokens.find((token) => token.symbol === 'USDT'))
      // );
    }
  }, [dispatch, fromChain, toChain, tokens]);

  const onChangeSendValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim() ?? 0;
    dispatch(setSendValue(value));
  };

  const onChangeFromChain = (chain: ChainInfo) => {
    dispatch(setFromChain(chain));
  };

  const onChangeSelectedToken = (token: TokenInfo) => {
    dispatch(setSendValue('0'));
    dispatch(setSelectedToken(token));
  };

  return (
    <Flex flexDir="column" gap={16}>
      <Flex alignItems="center" gap={16}>
        From
        <ChainSelector
          title="Select Source Chain"
          value={fromChain?.id}
          chains={chains}
          onChange={onChangeFromChain}
        />
      </Flex>

      <Flex
        flexDir="column"
        justifyContent="space-between"
        borderRadius={16}
        bg="bg.bottom"
        p={12}
        gap={8}
      >
        <Flex>Send:</Flex>
        <Flex gap={12}>
          <Flex flex={1} flexDir={'column'} gap={4}>
            <Input
              value={sendValue}
              onChange={onChangeSendValue}
              onKeyDown={handleKeyPress}
            />
            {!balance ? (
              <ErrorMsg>Insufficient balance</ErrorMsg>
            ) : (
              <Box>
                Balance:{' '}
                {formatUnits(balance, selectedToken?.decimal ?? 0) || ''}
              </Box>
            )}
          </Flex>
          <TokenSelector
            value={selectedToken?.symbol}
            tokens={tokens}
            onChange={onChangeSelectedToken}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}

function ErrorMsg(props: BoxProps) {
  return <Box color="scene.danger.normal" {...props} />;
}
