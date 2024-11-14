import { Flex, Skeleton, useColorMode, useTheme } from '@bnb-chain/space';

export const RouteSkeleton = () => {
  const theme = useTheme();
  const { colorMode } = useColorMode();

  return (
    <Flex
      className="bccb-widget-route-skeleton"
      p={'16px'}
      borderRadius={'8px'}
      flexDir={'column'}
      gap={'8px'}
      border={`1px solid ${theme.colors[colorMode].route.border}`}
    >
      <Flex justifyContent={'space-between'} alignItems={'center'} flexDir={'row'}>
        <Skeleton height="12px" width="160px" borderRadius={'8px'} />
        <Skeleton height="24px" width="80px" borderRadius={'100px'} />
      </Flex>
      <Flex gap={'8px'} flexDir={'row'}>
        <Skeleton height="24px" width="160px" borderRadius={'4px'} />
        <Skeleton height="24px" width="80px" borderRadius={'4px'} />
      </Flex>
      <Skeleton height="12px" width="100%" borderRadius={'4px'} />
      <Skeleton height="12px" width="100%" borderRadius={'4px'} />
    </Flex>
  );
};
