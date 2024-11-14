import { Flex, theme, useColorMode } from '@bnb-chain/space';

import { ExchangeChainIcon } from '@/core/components/icons/ExchangeChainIcon';

export const ExchangeChain = () => {
  const { colorMode } = useColorMode();
  return (
    <Flex
      className="bccb-widget-exchange-chain-icon"
      width="100%"
      alignSelf="center"
      justifyContent="center"
      alignItems={'center'}
      borderRadius={'50%'}
      background={theme.colors[colorMode].button.primary.subtle}
      w={'32px'}
      h={'32px'}
      mt={'28px'}
    >
      <ExchangeChainIcon h={'16px'} w={'16px'} />
    </Flex>
  );
};
