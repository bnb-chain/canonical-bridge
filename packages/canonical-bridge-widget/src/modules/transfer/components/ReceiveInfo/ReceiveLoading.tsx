import { Flex, Skeleton } from '@bnb-chain/space';

export const ReceiveLoading = () => {
  return (
    <Flex flexDir={'column'} gap={'8px'}>
      <Flex gap={'8px'} mb={'2px'}>
        <Skeleton height={'24px'} width={'160px'} />
        <Skeleton height={'24px'} width={'80px'} />
      </Flex>
      <Skeleton height={'12px'} width={'100%'} />
      <Skeleton height={'12px'} width={'100%'} />
    </Flex>
  );
};
