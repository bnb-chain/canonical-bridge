import { setToChain } from '@/app/transfer/action';
import { ChainSelector } from '@/app/transfer/components/ChainSelector';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Flex, Input } from '@node-real/uikit';
import { ChainInfo } from '@/bridges/index/types';
import { useSupportedToChains } from '@/app/transfer/hooks/useSupportedToChains';
import { useToTokenInfo } from '@/app/transfer/hooks/useToTokenInfo';
import { formatUnits } from 'viem';

export function ToSection() {
  const dispatch = useAppDispatch();

  const chains = useSupportedToChains();
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const receiveValue = useAppSelector((state) => state.transfer.receiveValue);
  const toTokenInfo = useToTokenInfo();
  const onChangeToChain = (chain: ChainInfo) => {
    dispatch(setToChain(chain));
  };

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
                toTokenInfo
                  ? `${formatUnits(
                      BigInt(receiveValue),
                      toTokenInfo?.decimal
                    )} ${toTokenInfo?.symbol}`
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
