import {
  setError,
  setReceiveValue,
  setSendValue,
  setTransferActionInfo,
} from '@/app/transfer/action';
import { ChainSelector } from '@/app/transfer/components/ChainSelector';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Flex, Input } from '@node-real/uikit';
import { useSupportedTokens } from '@/app/transfer/hooks/useSupportedTokens';
import { useSupportedFromChains } from '@/app/transfer/hooks/useSupportedFromChains';
import { ChainInfo, TokenInfo } from '@/bridges/main/types';
import { TokenSelector } from '@/app/transfer/components/TokenSelector';
import { TokenBalance } from '@/app/transfer/components/TokenBalance';
import { useSettingQuery } from '@/app/transfer/hooks/useSettingQuery';

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
  const { setQuery } = useSettingQuery();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);

  const onChangeSendValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim() ?? 0;
    dispatch(setSendValue(value));
  };

  const onChangeFromChain = (chain: ChainInfo) => {
    setQuery({
      fromChainId: chain.id,
    });
  };

  const onChangeSelectedToken = (token: TokenInfo) => {
    setQuery({
      tokenSymbol: token.symbol,
    });

    dispatch(setSendValue(''));
    dispatch(setReceiveValue(''));
    dispatch(setError(''));
    dispatch(setTransferActionInfo(undefined));
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
            <Input value={sendValue} onChange={onChangeSendValue} onKeyDown={handleKeyPress} />
            <TokenBalance />
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
