import { Flex, theme, useColorMode, useBreakpointValue, Box } from '@bnb-chain/space';

import { ASSET_PREFIX } from '@/dev/core/constants';
import { BridgeLinkItem } from '@/dev/core/components/ExternalBridgesPanel/BridgeLinkItem';
import { MobileBridgeLinkItem } from '@/dev/core/components/ExternalBridgesPanel/MobileBridgeLinkItem';

export const OP_BNB_BRIDGE_URL = 'https://opbnb-bridge.bnbchain.org/deposit';
export const GREENFIELD_BRIDGE_URL = 'https://greenfield.bnbchain.org/en/bridge?type=transfer-in';

const options = [
  {
    icon: `${ASSET_PREFIX}/images/bnb_blockchain.png`,
    name: 'opBNB Bridge',
    description: 'Transfer tokens between BSC & opBNB',
    url: OP_BNB_BRIDGE_URL,
    eventId: 'click_bridge_opBNB',
  },
  {
    icon: `${ASSET_PREFIX}/images/bnb_blockchain.png`,
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
      flexDir={'column'}
      mt={[theme.sizes['12'], theme.sizes['12'], theme.sizes['12'], 0]}
      gap={theme.sizes['3']}
    >
      {isBase && (
        <Box fontWeight={700} fontSize={theme.sizes['3.5']}>
          Transfer Tokens within BNB Chain Ecosystem
        </Box>
      )}
      <Flex
        p={[0, 0, 0, theme.sizes['4']]}
        bg={['none', 'none', 'none', theme.colors[colorMode].layer[3].default]}
        w="100%"
        maxW={['100%', '100%', '100%', '384px']}
        gap={[theme.sizes['2'], theme.sizes['2'], theme.sizes['2'], theme.sizes['3']]}
        borderRadius={[theme.sizes['3'], theme.sizes['3'], theme.sizes['3'], theme.sizes['6']]}
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
    </Flex>
  );
}