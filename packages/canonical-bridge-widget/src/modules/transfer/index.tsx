import {
  Box,
  Flex,
  useBreakpointValue,
  useColorMode,
  useDisclosure,
  useIntl,
  useTheme,
} from '@bnb-chain/space';

import { TransferOverview } from '@/modules/transfer/components/TransferOverview';
import { TransferButtonGroup } from '@/modules/transfer/components/TransferButtonGroup';
import { NetWorkSection } from '@/modules/transfer/components/NetWorkSection';
import { SendInput } from '@/modules/transfer/components/SendInput';
import { ReceiveInfo } from '@/modules/transfer/components/ReceiveInfo';
import { useDefaultSelectedInfo } from '@/modules/aggregator/hooks/useDefaultSelectedInfo';
import { RoutesModal } from '@/modules/transfer/components/TransferOverview/modal/RoutesModal';
import { useBridgeConfig } from '@/CanonicalBridgeProvider';
import { ToAccount } from '@/modules/transfer/components/ToAccount';

export function TransferWidget() {
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const isBase = useBreakpointValue({ base: true, lg: false }) ?? false;

  useDefaultSelectedInfo();

  const { isOpen, onClose, onOpen } = useDisclosure();
  const { appearance, routeContentBottom } = useBridgeConfig();

  return (
    <Flex
      flexDir={['column', 'column', 'column', 'row']}
      gap={[]}
      w={['100%']}
      mb={['120px', '120px', '160px']}
      alignItems={['flex-start', 'flex-start', 'center', 'flex-start']}
      justifyContent={'center'}
    >
      <Flex
        flexDir="column"
        background={['none', 'none', theme.colors[colorMode].background.main]}
        color={theme.colors[colorMode].text.primary}
        boxShadow={['none', 'none', `0 ${'24px'} ${'64px'} 0 rgba(0, 0, 0, 0.48)`]}
        borderRadius={'24px'}
        px={['0', '0', '24px']}
        py={['0', '0', '32px']}
        w={'100%'}
        maxW={['100%', '100%', '588px']}
        gap={'24px'}
        position="relative"
      >
        {appearance.bridgeTitle && (
          <Box
            as="h1"
            display={['none', 'none', 'block']}
            fontSize={'24px'}
            fontWeight={500}
            textAlign={'center'}
            borderBottom={`1px solid ${theme.colors[colorMode].border[2]}`}
            pb={'24px'}
          >
            {appearance.bridgeTitle}
          </Box>
        )}

        <NetWorkSection />
        <SendInput />
        <ToAccount />
        <ReceiveInfo onOpen={onOpen} />
        <Flex flexDir="column">
          <TransferButtonGroup />
        </Flex>
        {isBase ? routeContentBottom : null}
      </Flex>
      {!isBase ? (
        <TransferOverview routeContentBottom={routeContentBottom} />
      ) : (
        <RoutesModal
          title={formatMessage({ id: 'route.title.select.routes' })}
          isOpen={isOpen}
          onClose={onClose}
        >
          <TransferOverview />
        </RoutesModal>
      )}
    </Flex>
  );
}
