'use client';

import { FromBlock } from '@/app/transfer/components/FromBlock';
import { ToBlock } from '@/app/transfer/components/ToBlock';
import { TransferOverview } from '@/app/transfer/components/TransferOverview';
import { Flex } from '@node-real/uikit';

export default function Page() {
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

      <TransferOverview />
    </Flex>
  );
}
