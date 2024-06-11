import { ChainSelector } from '@/app/transfer/components/ChainSelector';
import { TokenSelector } from '@/app/transfer/components/TokenSelector';
import { useStore } from '@/providers/StoreProvider/hooks/useStore';
import { useSupportedToChains } from '@/providers/StoreProvider/hooks/useSupportedToChains';
import { useSupportedToTokens } from '@/providers/StoreProvider/hooks/useSupportedToTokens';
import { Flex } from '@node-real/uikit';
import { useEffect, useMemo } from 'react';

export function ToBlock() {
  const {
    toChainId,
    toTokenInfo,
    setToChainId,
    setToTokenInfo,
    fromTokenInfo,
  } = useStore();

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
      decimal: item.token.decimal,
      bridgeAddress: item.bridgeAddress || '',
    }));
  }, [tokens]);

  useEffect(() => {
    setToChainId(chains?.[0]?.id);
  }, [chains, setToChainId]);

  useEffect(() => {
    const selectedToken = tokenOptions.filter(
      (item) => item.symbol === fromTokenInfo.fromTokenSymbol
    );
    setToTokenInfo({
      toTokenAddress: selectedToken?.[0]?.value,
      toTokenSymbol: selectedToken?.[0]?.symbol,
      toTokenDecimal: selectedToken?.[0]?.decimal,
    });
  }, [setToTokenInfo, tokenOptions, fromTokenInfo.fromTokenSymbol]);

  const onChangeChainId = (chainId: number) => {
    setToChainId(chainId);
  };

  const onChangeTokenAddress = ({
    tokenAddress,
    tokenSymbol,
    tokenDecimal,
  }: {
    tokenAddress: string;
    tokenSymbol: string;
    tokenDecimal: number;
  }) => {
    console.log('decimal ', tokenDecimal);
    setToTokenInfo({
      toTokenAddress: tokenAddress,
      toTokenSymbol: tokenSymbol,
      toTokenDecimal: tokenDecimal,
    });
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
            value={{
              tokenAddress: toTokenInfo.toTokenAddress,
              tokenSymbol: toTokenInfo.toTokenSymbol,
              tokenDecimal: toTokenInfo.toTokenDecimal,
            }}
            options={tokenOptions}
            onChange={onChangeTokenAddress}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
