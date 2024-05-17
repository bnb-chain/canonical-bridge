import { ChainSelector } from '@/app/transfer/components/ChainSelector';
import { TokenSelector } from '@/app/transfer/components/TokenSelector';
import { useStore } from '@/providers/StoreProvider/hooks/useStore';
import { useSupportedToChains } from '@/providers/StoreProvider/hooks/useSupportedToChains';
import { useSupportedToTokens } from '@/providers/StoreProvider/hooks/useSupportedToTokens';
import { Flex } from '@node-real/uikit';
import { useEffect, useMemo } from 'react';

export function ToBlock() {
  const { toChainId, toTokenAddress, setToChainId, setToTokenAddress } =
    useStore();

  const chains = useSupportedToChains();
  const tokens = useSupportedToTokens();

  const chainOptions = useMemo(() => {
    return chains.map((item) => ({
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
    setToChainId(chains?.[0]?.id);
  }, [chains, setToChainId]);

  useEffect(() => {
    setToTokenAddress(tokens?.[0]?.token?.address ?? '');
  }, [setToTokenAddress, tokens]);

  const onChangeChainId = (chainId: number) => {
    setToChainId(chainId);
  };

  const onChangeTokenAddress = (tokenAddress: string) => {
    setToTokenAddress(tokenAddress);
  };

  return (
    <Flex flexDir="column" gap={16}>
      <Flex alignItems="center" gap={16}>
        To
        <ChainSelector
          title="Select Destination Chain"
          value={toChainId}
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
        <Flex>Receive (estimated):</Flex>
        <Flex gap={12}>
          <Flex flex={1}></Flex>
          <TokenSelector
            title="Select a token"
            value={toTokenAddress}
            options={tokenOptions}
            onChange={onChangeTokenAddress}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
