'use client';

import { FromSection } from '@/app/transfer/components/FromSection';
import { ToSection } from '@/app/transfer/components/ToSection';
import { useInitialConfig } from '@/app/transfer/hooks/useInitialConfig';
import { TransferOverview } from '@/app/transfer/components/TransferOverview';

import { Button, Flex } from '@node-real/uikit';

export default function Page() {
  useInitialConfig();

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
      <FromSection />
      <ToSection />

      <Flex flexDir="column" mt={32}>
        <Button isDisabled={false} color="light.readable.normal" w="100%">
          Transfer
        </Button>
      </Flex>

      <TransferOverview />
    </Flex>
  );
}
