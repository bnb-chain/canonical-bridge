'use client';

import { useFetchTransferConfigs } from '@/adapters/api/useFetchTransferConfigs';
import { ChainSelector } from '@/app/transfer/components/ChainSelector';
import { TokenSelector } from '@/app/transfer/components/TokenSelector';
import { Box, Button, Flex, Input } from '@node-real/uikit';
import { useState } from 'react';

export default function Page() {
  const { isLoading, data } = useFetchTransferConfigs();

  const [fromChain, setFromChain] = useState('Ethereum');
  const [toChain, setToChain] = useState('Ethereum');

  const [fromToken, setFromToken] = useState('USDT');
  const [toToken, setToToken] = useState('USDT');

  const [transferValue, setTransferValue] = useState('');
  const [canTransfer, setCanTransfer] = useState(false);

  const onChangeFromChain = (value: string) => {
    setFromChain(value);
  };

  const onChangeToChain = (value: string) => {
    setToChain(value);
  };

  const onChangeFromToken = (value: string) => {
    setFromToken(value);
  };

  const onChangeToToken = (value: string) => {
    setToToken(value);
  };

  const onChangeTransferValue = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTransferValue(event.target.value);
  };

  console.log(data, '===');

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
      <Flex flexDir="column" gap={16}>
        <Flex alignItems="center" gap={16}>
          From
          <ChainSelector
            title="Select Source Chain"
            value={fromChain}
            onChange={onChangeFromChain}
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
            <Input
              value={transferValue}
              onChange={onChangeTransferValue}
            ></Input>
            <TokenSelector
              title="Select a token"
              value={fromToken}
              chain={fromChain}
              onChange={onChangeFromToken}
            />
          </Flex>
        </Flex>
      </Flex>

      <Flex flexDir="column" gap={16}>
        <Flex alignItems="center" gap={16}>
          To
          <ChainSelector
            title="Select Destination Chain"
            value={toChain}
            onChange={onChangeToChain}
          />
        </Flex>
        <Box h={120} borderRadius={16} bg="bg.bottom" p={12}>
          <Flex>Receive (estimated):</Flex>
        </Box>
      </Flex>

      <Flex flexDir="column" mt={32}>
        <Button isDisabled={canTransfer} color="light.readable.normal" w="100%">
          Transfer
        </Button>
      </Flex>
    </Flex>
  );
}
