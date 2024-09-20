import { Box, Center, Flex, Icon, IconProps, Image, theme, useColorMode } from '@bnb-chain/space';

export interface ExternalBridgesPanelProps {
  item: {
    icon: string;
    name: string;
    description: string;
    url: string;
    eventId: string;
  };
}

export const TopRightArrowIcon = (props: IconProps) => {
  return (
    <Icon
      width="32px"
      height="32px"
      viewBox="0 0 32 32"
      color="#F7F7F8"
      fill="currentColor"
      {...props}
    >
      <path d="M22.1205 11.405L9.71023 23.823C9.51194 24.0213 9.27648 24.1205 9.00383 24.1205C8.73119 24.1205 8.49572 24.0213 8.29743 23.823C8.09914 23.6247 8 23.3893 8 23.1166C8 22.844 8.09914 22.6085 8.29743 22.4102L20.7154 9.99993H9.78717C9.50383 9.99993 9.26634 9.90407 9.0747 9.71233C8.88303 9.52058 8.7872 9.28298 8.7872 8.99953C8.7872 8.71607 8.88303 8.47861 9.0747 8.28717C9.26634 8.09572 9.50383 8 9.78717 8H22.9154C23.2568 8 23.543 8.11549 23.774 8.34647C24.005 8.57745 24.1205 8.86366 24.1205 9.2051V22.3333C24.1205 22.6166 24.0246 22.8541 23.8329 23.0458C23.6411 23.2374 23.4035 23.3333 23.1201 23.3333C22.8366 23.3333 22.5991 23.2374 22.4077 23.0458C22.2163 22.8541 22.1205 22.6166 22.1205 22.3333V11.405Z" />
    </Icon>
  );
};

export const BridgeLinkItem = ({ item }: ExternalBridgesPanelProps) => {
  const { colorMode } = useColorMode();

  return (
    <Flex
      as="a"
      href={item.url}
      target="_blank"
      flexDir="column"
      p={theme.sizes['3']}
      border={`1px solid`}
      borderColor={theme.colors[colorMode].border[3]}
      bg={theme.colors[colorMode].layer[2].default}
      gap={theme.sizes['2']}
      borderRadius={theme.sizes['2']}
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
      <Flex justifyContent="space-between" alignItems="flex-start">
        <Center boxSize={theme.sizes['12']}>
          <Image boxSize={'38px'} src={item.icon} alt="bnb_chain"></Image>
        </Center>
        <TopRightArrowIcon
          className="arrow"
          color={theme.colors[colorMode].text.tertiary}
          transitionDuration="normal"
          transitionProperty="colors"
        />
      </Flex>
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
  );
};
