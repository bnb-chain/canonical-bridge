'use client';

import { FromBlock } from '@/app/transfer/components/FromBlock';
import { ToBlock } from '@/app/transfer/components/ToBlock';
import { TransferOverview } from '@/app/transfer/components/TransferOverview';
import { useStore } from '@/providers/StoreProvider/hooks/useStore';
import { Button, Flex } from '@node-real/uikit';

export default function Page() {
  const { fromChainId, fromTokenAddress, toChainId, toTokenAddress } =
    useStore();

  console.log(fromChainId, fromTokenAddress, toChainId, toTokenAddress);

  return (
    <Flex
      flexDir="column"
      bg="bg.middle"
      border="1px solid readable.border"
      borderRadius={16}
      p={24}
      w={650}
      gap={16}
      position="relative"
    >
      <FromBlock />
      <ToBlock />

      <Flex flexDir="column" mt={32}>
        <Button isDisabled={false} color="light.readable.normal" w="100%">
          Transfer
        </Button>
      </Flex>

      <TransferOverview />
    </Flex>
  );
}
