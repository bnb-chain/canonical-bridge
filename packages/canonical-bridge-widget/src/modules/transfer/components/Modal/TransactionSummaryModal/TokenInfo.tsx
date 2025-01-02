import { Box, Flex, theme, useColorMode } from '@bnb-chain/space';

import { IconImage } from '@/core/components/IconImage';

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

  return (
    <Flex flexDir={'row'} justifyContent={'space-between'} w={'100%'} alignItems={'center'}>
      <Flex flexDir={'row'} gap={'14px'} alignItems={'center'}>
        <Box w={'32px'} h={'32px'} position={'relative'}>
          <IconImage
            position={'absolute'}
            bottom={'-4px'}
            right={'-4px'}
            boxSize="16px"
            src={chainIconUrl}
            flexShrink={0}
          />
          <IconImage boxSize="32px" src={tokenIconUrl} flexShrink={0} />
        </Box>
        <Box fontSize={'16px'} fontWeight={700}>
          {chainName}
        </Box>
      </Flex>
      <Box
        color={
          Number(amount) < 0
            ? theme.colors[colorMode].support.danger[3]
            : theme.colors[colorMode].support.success[3]
        }
      >
        {amount ?? '--'} {tokenSymbol}
      </Box>
    </Flex>
  );
};
