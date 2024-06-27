import { ChainSelector } from '@/app/transfer/components/ChainSelector';
import { useAppSelector } from '@/store/hooks';
import { Flex, Input } from '@node-real/uikit';
import { ChainInfo } from '@/bridges/main/types';
import { useSupportedToChains } from '@/app/transfer/hooks/useSupportedToChains';
import { useToTokenInfo } from '@/app/transfer/hooks/useToTokenInfo';
import { formatUnits } from 'viem';
import { useSettingQuery } from '@/app/transfer/hooks/useSettingQuery';
import { useMemo } from 'react';

export function ToSection() {
  const { setQuery } = useSettingQuery();

  const chains = useSupportedToChains();
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const receiveValue = useAppSelector((state) => state.transfer.receiveValue);
  const toTokenInfo = useToTokenInfo();
  const onChangeToChain = (chain: ChainInfo) => {
    setQuery({
      toChainId: chain.id,
    });
  };
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);

  const receiveAmt = useMemo(() => {
    if (!receiveValue) return null;
    // TODO: May need to choose which bridge receive amount to show first
    return receiveValue?.cbridge || receiveValue?.debridge;
  }, [receiveValue]);

  return (
    <Flex flexDir="column" gap={16}>
      <Flex alignItems="center" gap={16}>
        To
        <ChainSelector
          title="Select Destination Chain"
          value={toChain?.id}
          chains={chains}
          onChange={onChangeToChain}
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
        <Flex>Receive:</Flex>
        <Flex gap={12}>
          <Flex flex={1} flexDir={'column'}>
            <Input
              value={
                toTokenInfo && receiveAmt && !isGlobalFeeLoading
                  ? `${formatUnits(BigInt(receiveAmt), toTokenInfo?.decimal)} ${
                      toTokenInfo?.symbol
                    }`
                  : ''
              }
              readOnly
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
