import { Box, Flex, Skeleton, theme, useColorMode } from '@bnb-chain/space';

import { IconImage } from '@/core/components/IconImage';
import { useAppSelector } from '@/modules/store/StoreProvider';

export const TokenInfo = ({
  chainIconUrl,
  tokenIconUrl,
  chainName,
  amount,
  tokenSymbol,
}: {
  chainIconUrl?: string;
  tokenIconUrl?: string;
  chainName?: string;
  amount?: string;
  tokenSymbol?: string;
}) => {
  const { colorMode } = useColorMode();
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);

  return (
    <Flex flexDir={'row'} justifyContent={'space-between'} w={'100%'} alignItems={'center'}>
      <Flex flexDir={'row'} alignItems={'center'}>
        <Box w={'32px'} h={'32px'} position={'relative'}>
          <IconImage
            position={'absolute'}
            bottom={'-4px'}
            right={'-4px'}
            boxSize="16px"
            src={tokenIconUrl}
            flexShrink={0}
          />
          <IconImage boxSize="32px" src={chainIconUrl} flexShrink={0} />
        </Box>
        <Box fontSize={'16px'} py={'8px'} fontWeight={700}>
          {chainName}
        </Box>
      </Flex>
      {isGlobalFeeLoading ? (
        <Skeleton height="24px" maxW="120px" w={'100%'} borderRadius={'4px'} />
      ) : (
        <Box
          wordBreak={'break-all'}
          py={'8px'}
          color={
            Number(amount) < 0
              ? theme.colors[colorMode].support.danger[3]
              : theme.colors[colorMode].support.success[3]
          }
        >
          {amount ?? '--'} {tokenSymbol}
        </Box>
      )}
    </Flex>
  );
};
