import {
  Box,
  Center,
  Flex,
  theme,
  useColorMode,
  Image,
  IconProps,
  Icon,
  useBreakpointValue,
} from '@bnb-chain/space';

import { env } from '@/core/configs/env';
import { BridgeLinkItem } from '@/dev/components/ExternalBridgesPanel/BridgeLinkItem';
import { MobileBridgeLinkItem } from '@/dev/components/ExternalBridgesPanel/MobileBridgeLinkItem';

export const OP_BNB_BRIDGE_URL = 'https://opbnb-bridge.bnbchain.org/deposit';
export const GREENFIELD_BRIDGE_URL = 'https://greenfield.bnbchain.org/en/bridge?type=transfer-in';

const options = [
  {
    icon: `${env.ASSET_PREFIX}/images/bnb_blockchain.png`,
    name: 'opBNB Bridge',
    description: 'Transfer tokens between BSC & opBNB',
    url: OP_BNB_BRIDGE_URL,
    eventId: 'click_bridge_opBNB',
  },
  {
    icon: `${env.ASSET_PREFIX}/images/bnb_blockchain.png`,
    name: 'Greenfield Bridge',
    description: 'Transfer tokens between BSC & BNB Greenfield',
    url: GREENFIELD_BRIDGE_URL,
    eventId: 'click_bridge_Greenfield',
  },
];

export function ExternalBridgesPanel() {
  const { colorMode } = useColorMode();
  const isBase = useBreakpointValue({ base: true, lg: false }) ?? false;

  return (
    <Flex
      p={[0, 0, 0, theme.sizes['4']]}
      bg={theme.colors[colorMode].layer[3].default}
      w="100%"
      maxW={['100%', '100%', '100%', '384px']}
      gap={theme.sizes['3']}
      borderRadius={theme.sizes['2']}
      color={theme.colors[colorMode].text.primary}
      flexDir={['column', 'column', 'column', 'row']}
    >
      {options.map((item, index) => {
        return !isBase ? (
          <BridgeLinkItem key={index} item={item} />
        ) : (
          <MobileBridgeLinkItem key={index} item={item} />
        );
      })}
    </Flex>
  );
}
