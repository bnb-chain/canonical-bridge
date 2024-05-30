import { ChainSelector } from '@/app/transfer/components/ChainSelector';
import { TokenSelector } from '@/app/transfer/components/TokenSelector';
import { CBridgeChain } from '@/bridges/cbridge/types';
import { useStore } from '@/providers/StoreProvider/hooks/useStore';
import { useSupportedFromChains } from '@/providers/StoreProvider/hooks/useSupportedFromChains';
import { useSupportedFromTokens } from '@/providers/StoreProvider/hooks/useSupportedFromTokens';
import { Flex, Input } from '@node-real/uikit';
import { useEffect, useMemo } from 'react';

export function FromBlock() {
  const {
    fromChainId,
    fromTokenAddress,
    transferValue,
    setFromChainId,
    setFromTokenAddress,
    setTransferValue,
  } = useStore();

  const chains = useSupportedFromChains();
  const tokens = useSupportedFromTokens();

  const chainOptions = useMemo(() => {
    return chains.map((item: CBridgeChain) => ({
      value: item.id,
      label: item.name,
      icon: item.icon,
    }));
  }, [chains]);

  const tokenOptions = useMemo(() => {
    return tokens.map((item) => ({
      value: item.token.address,
      label: item.name || item.token.symbol,
      icon: item.icon,
      symbol: item.token.symbol,
    }));
  }, [tokens]);

  useEffect(() => {
    setFromTokenAddress(tokens?.[0]?.token?.address ?? '');
  }, [setFromTokenAddress, tokens]);

  const onChangeChainId = (chainId: number) => {
    setFromChainId(chainId);
  };

  const onChangeTokenAddress = (tokenAddress: string) => {
    setFromTokenAddress(tokenAddress);
  };

  const onChangeTransferValue = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value.trim() ?? 0;
    setTransferValue(value);
  };

  return (
    <Flex flexDir="column" gap={16}>
      <Flex alignItems="center" gap={16}>
        From
        <ChainSelector
          title="Select Source Chain"
          value={fromChainId}
          options={chainOptions}
          onChange={onChangeChainId}
        />
      </Flex>

      <Flex
        flexDir="column"
        justifyContent="space-between"
        h={120}
        borderRadius={16}
        bg="bg.bottom"
        p={12}
      >
        <Flex>Send:</Flex>
        <Flex gap={12}>
          <Input value={transferValue} onChange={onChangeTransferValue} />
          <TokenSelector
            title="Select a token"
            value={fromTokenAddress}
            options={tokenOptions}
            onChange={onChangeTokenAddress}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
