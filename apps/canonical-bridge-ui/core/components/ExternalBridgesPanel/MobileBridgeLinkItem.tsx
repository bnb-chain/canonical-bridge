import { Box, Center, Flex, Image, theme, useColorMode } from '@bnb-chain/space';

import {
  ExternalBridgesPanelProps,
  TopRightArrowIcon,
} from '@/core/components/ExternalBridgesPanel/BridgeLinkItem';

export const MobileBridgeLinkItem = ({ item }: ExternalBridgesPanelProps) => {
  const { colorMode } = useColorMode();

  return (
    <Flex
      as="a"
      href={item.url}
      target="_blank"
      flexDir="row"
      justifyContent={'space-between'}
      alignItems={'flex-start'}
      p={theme.sizes['3']}
      border={`1px solid`}
      borderColor={theme.colors[colorMode].border[3]}
      bg={theme.colors[colorMode].layer[2].default}
      gap={theme.sizes['2']}
      borderRadius={theme.sizes['3']}
      transitionDuration="normal"
      transitionProperty="colors"
      flex={1}
      _hover={{
        bg: theme.colors[colorMode].layer[2].hover,
        '.arrow': {
          color: theme.colors[colorMode].text.primary,
        },
      }}
    >
      <Flex gap={'8px'}>
        <Flex justifyContent="space-between" alignItems="flex-start">
          <Center boxSize={theme.sizes['12']}>
            <Image boxSize={'36px'} src={item.icon} alt="bnb_chain"></Image>
          </Center>
        </Flex>
        <Flex maxW={'307px'} w={'100%'} flexDir={'column'} gap={theme.sizes['1']}>
          <Box lineHeight={theme.sizes['6']}>{item.name}</Box>
          <Box
            fontWeight={400}
            fontSize={theme.sizes['3']}
            lineHeight={theme.sizes['4']}
            color={theme.colors[colorMode].text.tertiary}
          >
            {item.description}
          </Box>
        </Flex>
      </Flex>
      <TopRightArrowIcon
        className="arrow"
        color={theme.colors[colorMode].text.tertiary}
        w={'24px'}
        h={'24px'}
        transitionDuration="normal"
        transitionProperty="colors"
      />
    </Flex>
  );
};
