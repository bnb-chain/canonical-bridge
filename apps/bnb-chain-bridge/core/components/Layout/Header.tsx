import { Flex, FlexProps, theme, useColorMode } from '@bnb-chain/space';
import { ConnectButton } from '@bnb-chain/canonical-bridge-widget';

import { LogoIcon } from '@/core/components/icons/Logo';

export function Header(props: FlexProps) {
  const { colorMode } = useColorMode();

  return (
    <Flex
      as="header"
      h={['64px', '64px', '64px', '80px']}
      borderBottom={`1px solid ${theme.colors[colorMode].border['3']}`}
      alignItems="center"
      justifyContent="space-between"
      px={['20px', '20px', '20px', '64px']}
      bg={theme.colors[colorMode].layer[2].default}
      gap="16px"
      {...props}
    >
      <LogoIcon w={['77px', '77px', '77px', '129px']} flexShrink={0} />
      <ConnectButton />
    </Flex>
  );
}
