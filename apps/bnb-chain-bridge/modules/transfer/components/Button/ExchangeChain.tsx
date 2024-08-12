import { Flex, theme, useColorMode } from '@bnb-chain/space';

import { ExchangeChainIcon } from '@/core/components/icons/ExchangeChainIcon';

export const ExchangeChain = () => {
  const { colorMode } = useColorMode();
  return (
    <Flex
      width={'100%'}
      margin={'0 auto'}
      justifyContent={'center'}
      alignItems={'center'}
      borderRadius={'50%'}
      background={theme.colors[colorMode].button.primary.subtle}
      w={theme.sizes['8']}
      h={theme.sizes['8']}
      mt={theme.sizes['2']}
    >
      <ExchangeChainIcon h={theme.sizes['4']} w={theme.sizes['4']} />
    </Flex>
  );
};
