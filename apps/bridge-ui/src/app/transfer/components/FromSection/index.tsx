import {
  setFromChain,
  setSelectedToken,
  setSendValue,
} from '@/app/transfer/action';
import { ChainSelector } from '@/app/transfer/components/ChainSelector';
import { useDebounce } from '@/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Box, BoxProps, Flex, Input } from '@node-real/uikit';
import { useGetTokenBalance } from '@/contract/hooks/useGetTokenBalance';
import { formatUnits } from 'viem';
import { useSupportedTokens } from '@/app/transfer/hooks/useSupportedTokens';
import { useSupportedFromChains } from '@/app/transfer/hooks/useSupportedFromChains';
import { ChainInfo, TokenInfo } from '@/bridges/index/types';
import { useEffect } from 'react';
import { TokenSelector } from '@/app/transfer/components/TokenSelector';

export function FromSection() {
  const dispatch = useAppDispatch();

  const chains = useSupportedFromChains();
  const tokens = useSupportedTokens();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  const { balance } = useGetTokenBalance({
    tokenAddress: selectedToken.address as `0x${string}`,
  });

  useEffect(() => {
    if (!fromChain?.id) {
      dispatch(setFromChain(chains[1]));
    }
  }, [chains, dispatch, fromChain?.id]);

  useEffect(() => {
    if (fromChain.id && toChain.id) {
      dispatch(setSelectedToken(tokens[0]));
    }
  }, [dispatch, fromChain.id, toChain.id, tokens]);

  const onChangeSendValue = useDebounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.trim() ?? 0;
      dispatch(setSendValue(value));
    },
    1000
  );

  const onChangeFromChain = (chain: ChainInfo) => {
    dispatch(setFromChain(chain));
  };

  const onChangeSelectedToken = (token: TokenInfo) => {
    dispatch(setSelectedToken(token));
  };

  return (
    <Flex flexDir="column" gap={16}>
      <Flex alignItems="center" gap={16}>
        From
        <ChainSelector
          title="Select Source Chain"
          value={fromChain.id}
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
              step={'0.000000001'}
              pattern="[0-9]"
              onChange={onChangeSendValue}
              // isDisabled={!balance}
            />
            {!balance ? (
              <ErrorMsg>Insufficient balance</ErrorMsg>
            ) : (
              <Box>
                Balance: {formatUnits(balance, selectedToken.decimal) || ''}
              </Box>
            )}
          </Flex>
          <TokenSelector
            value={selectedToken.symbol}
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
