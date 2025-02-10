import { Flex, FlexProps, theme, useColorMode } from '@bnb-chain/space';
import React from 'react';

import { LogoIcon } from '@/core/components/icons/Logo';
import { ConnectWalletButton } from '@/core/wallet/components/ConnectWalletButton';

export function Header(props: FlexProps) {
  const { colorMode } = useColorMode();

  return (
    <>
      <Flex
        as="header"
        h={['64px', '64px', '64px', '80px']}
        borderBottom={`1px solid ${theme.colors[colorMode].border['3']}`}
        alignItems="center"
        justifyContent="space-between"
        px={['20px', '20px', '20px', '64px']}
        bg={theme.colors[colorMode].layer[2].default}
        zIndex={1}
        {...props}
      >
        <LogoIcon />
        <ConnectWalletButton />
      </Flex>

      <Flex
        fontSize="16px"
        px={['20px', '20px', '20px', '64px']}
        py={'8px'}
        justifyContent="center"
        bg="#F8545F"
      >
        This demo is for testing purposes only and non-developers should not use it to send
        transactions.
      </Flex>
    </>
  );
}
