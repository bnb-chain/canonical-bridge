import { Flex, Skeleton, SkeletonCircle, useBreakpointValue } from '@bnb-chain/space';

export const ReceiveLoading = () => {
  const isBase = useBreakpointValue({ base: true, lg: false }) ?? false;

  return !isBase ? (
    <Flex flexDir={'column'} gap={'8px'}>
      <Flex gap={'8px'} mb={'2px'}>
        <Skeleton height={'24px'} width={'160px'} />
        <Skeleton height={'24px'} width={'80px'} />
      </Flex>
      <Skeleton height={'12px'} maxW={'333px'} width={'100%'} />
      <Skeleton height={'12px'} maxW={'371px'} width={'100%'} />
    </Flex>
  ) : (
    <Flex flexDir={'row'} alignItems={'flex-start'} justifyContent={'space-between'} gap={'23px'}>
      <Flex flexDir={'column'} flex={1} gap={'8px'}>
        <Flex gap={'8px'} mb={'2px'} flexDir={'row'}>
          <Skeleton height={'12px'} flexBasis={'66%'} />
          <Skeleton height={'12px'} flexBasis={'33%'} />
        </Flex>
        <Flex gap={'8px'} mb={'2px'}>
          <Skeleton height={'24px'} flexBasis={'66%'} />
          <Skeleton height={'24px'} flexBasis={'33%'} />
        </Flex>

        <Flex gap={'8px'} mb={'2px'}>
          <Skeleton height={'16px'} width={'100%'} borderRadius={'4px'} />
        </Flex>
        <Flex gap={'8px'} mb={'2px'}>
          <Skeleton height={'16px'} width={'100%'} borderRadius={'4px'} />
        </Flex>
        <Flex gap={'8px'} mb={'2px'}>
          <Skeleton height={'16px'} width={'100%'} borderRadius={'4px'} />
        </Flex>
      </Flex>

      <SkeletonCircle w={'32px'} h={'32px'} />
    </Flex>
  );
};
