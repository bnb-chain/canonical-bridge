'use client';

import { FromBlock } from '@/app/transfer/components/FromBlock';
import { ToBlock } from '@/app/transfer/components/ToBlock';
import { useStore } from '@/providers/StoreProvider/hooks/useStore';
import { Button, Flex } from '@node-real/uikit';

export default function Page() {
  // const { fromChainId } = useStore();

  return (
    <Flex
      flexDir="column"
      bg="bg.middle"
      border="1px solid readable.border"
      borderRadius={16}
      p={24}
      w={650}
      gap={16}
    >
      <FromBlock />
      <ToBlock />

      <Flex flexDir="column" mt={32}>
        <Button isDisabled={false} color="light.readable.normal" w="100%">
          Transfer
        </Button>
      </Flex>
    </Flex>
  );
}
