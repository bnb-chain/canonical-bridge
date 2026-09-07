import { Flex, FlexProps, useColorMode, useTheme } from '@bnb-chain/space';

import { ExchangeIcon } from '@/core/components/icons/ExchangeIcon';
import { useSelection } from '@/modules/aggregator/hooks/useSelection';
import { EventTypes, useAnalytics } from '@/core/analytics';

export function ExchangeChainButton(props: FlexProps) {
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const { exchange } = useSelection();
  const { emit } = useAnalytics();

  return (
    <Flex
      className="bccb-widget-exchange-chain-icon"
      width="100%"
      alignSelf="center"
      justifyContent="center"
      alignItems={'center'}
      borderRadius={'50%'}
      background={theme.colors[colorMode].button.exchange.default}
      color={theme.colors[colorMode].text.secondary}
      _hover={{
        color: theme.colors[colorMode].text.inverse,
        bg: theme.colors[colorMode].button.exchange.hover,
      }}
      transition="normal"
      w={'24px'}
      h={'24px'}
      cursor="pointer"
      m={{ base: '12px 0 4px', md: '0 12px 0 12px' }}
      onClick={() => {
        exchange();
        emit(EventTypes.CLICK_BRIDGE_SWITCH_NETWORK, null);
      }}
      {...props}
    >
      <ExchangeIcon transform={{ base: 'rotate(90deg)', md: 'none' }} />
    </Flex>
  );
}
