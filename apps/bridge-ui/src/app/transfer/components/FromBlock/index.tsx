import { ChainSelector } from '@/app/transfer/components/ChainSelector';
import { TokenSelector } from '@/app/transfer/components/TokenSelector';
import { CBridgeChain, CBridgeToken } from '@/bridges/cbridge/types';
import { useDebounce } from '@/bridges/utils';
import { useGetTokenBalance } from '@/contract/hooks/useGetTokenBalance';
import { useStore } from '@/providers/StoreProvider/hooks/useStore';
import { useSupportedFromChains } from '@/providers/StoreProvider/hooks/useSupportedFromChains';
import { useSupportedFromTokens } from '@/providers/StoreProvider/hooks/useSupportedFromTokens';
import styled from '@emotion/styled';
import { Box, Flex, Input } from '@node-real/uikit';
import { useEffect, useMemo } from 'react';
import { formatUnits } from 'viem';

export function FromBlock() {
  const {
    fromChainId,
    fromTokenInfo,
    setFromChainId,
    setFromTokenInfo,
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
  const { balance } = useGetTokenBalance({
    tokenAddress: fromTokenInfo.fromTokenAddress as `0x${string}`,
  });
  const tokenOptions = useMemo(() => {
    return tokens.map((item: CBridgeToken) => ({
      value: item.token.address,
      label: item.name || item.token.symbol,
      icon: item.icon,
      symbol: item.token.symbol,
      method: item.method ?? '',
      decimal: item.token.decimal,
      bridgeAddress: item.bridgeAddress || '',
    }));
  }, [tokens]);

  useEffect(() => {
    setFromTokenInfo({
      fromTokenAddress: tokens?.[0]?.token?.address ?? '',
      fromTokenSymbol: tokens?.[0]?.token?.symbol ?? '',
      fromTokenMethod: tokens?.[0]?.method ?? '',
      fromTokenDecimal: tokens?.[0]?.token?.decimal,
      bridgeAddress: tokens?.[0]?.bridgeAddress ?? '',
    });
  }, [setFromTokenInfo, tokens]);

  const onChangeChainId = (chainId: number) => {
    setFromChainId(chainId);
  };

  const onChangeTokenInfo = ({
    tokenAddress,
    tokenSymbol,
    tokenMethod,
    tokenDecimal,
    bridgeAddress,
  }: {
    tokenAddress: string;
    tokenSymbol: string;
    tokenMethod: any;
    tokenDecimal: number;
    bridgeAddress: string;
  }) => {
    setFromTokenInfo({
      fromTokenAddress: tokenAddress,
      fromTokenSymbol: tokenSymbol,
      fromTokenMethod: tokenMethod,
      fromTokenDecimal: tokenDecimal,
      bridgeAddress,
    });
  };

  const onChangeTransferValue = useDebounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.trim() ?? 0;
      setTransferValue(value);
    },
    1000
  );

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
          <Flex flex={1} flexDir={'column'}>
            <Input
              step={'0.000000001'}
              pattern="[0-9]"
              // value={transferValue}
              onChange={onChangeTransferValue}
              disabled={!balance}
            />
            {!balance ? (
              <ErrorMsg>Insufficient balance</ErrorMsg>
            ) : (
              <Box>
                Balance:{' '}
                {formatUnits(balance, fromTokenInfo.fromTokenDecimal) || ''}
              </Box>
            )}
          </Flex>
          <TokenSelector
            title="Select a token"
            value={{
              tokenAddress: fromTokenInfo.fromTokenAddress,
              tokenSymbol: fromTokenInfo.fromTokenSymbol,
              tokenDecimal: fromTokenInfo.fromTokenDecimal,
              tokenMethod: fromTokenInfo.fromTokenMethod,
              bridgeAddress: fromTokenInfo.bridgeAddress,
            }}
            options={tokenOptions}
            onChange={onChangeTokenInfo}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}

const ErrorMsg = styled(Box)`
  color: ${(props: any) => props.theme.colors.scene.danger.normal};
`;
