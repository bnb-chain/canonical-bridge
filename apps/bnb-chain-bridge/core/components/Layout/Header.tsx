import { Flex, FlexProps, theme, useColorMode } from '@bnb-chain/space';

import { LogoIcon } from '@/core/components/icons/Logo';
import { HeaderInfo } from '@/core/components/HeaderInfo';

export function Header(props: FlexProps) {
  const { colorMode } = useColorMode();

  return (
    <Flex
      as="header"
      h={theme.sizes['20']}
      borderBottom={`1px solid ${theme.colors[colorMode].border['3']}`}
      alignItems="center"
      justifyContent="space-between"
      px={theme.sizes['16']}
      bg={theme.colors[colorMode].layer[2].default}
      {...props}
    >
      <LogoIcon />
      <HeaderInfo />
    </Flex>
  );
}
