import {
  Box,
  Flex,
  Typography,
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
import { SvgDefs } from '@/core/components/icons/defs.tsx';

export function TransferWidget() {
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const isBase = useBreakpointValue({ base: true, lg: false }) ?? false;

  useDefaultSelectedInfo();

  const { isOpen, onClose, onOpen } = useDisclosure();
  const { appearance, routeContentBottom, bridgeBottom } = useBridgeConfig();

  return (
    <>
      <SvgDefs />
      <Flex
        className="bccb-widget-transfer-widget"
        flexDir={['column', 'column', 'column', 'row']}
        w={['100%']}
        mb={['120px', '120px', '160px']}
        alignItems={['flex-start', 'flex-start', 'center', 'flex-start']}
        justifyContent={'center'}
      >
        <Box>
          <Flex
            className="bccb-widget-transfer-widget-wrapper"
            flexDir="column"
            background={['none', 'none', theme.colors[colorMode].layer[2].default]}
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
              <Typography
                className="bccb-widget-transfer-widget-title"
                variant={'heading'}
                size={{ base: 'xs', md: 'sm' }}
                as="h1"
                fontWeight={700}
                textAlign={'center'}
                mb={'-4px'}
              >
                {appearance.bridgeTitle}
              </Typography>
            )}

            <NetWorkSection />
            <SendInput />
            <ToAccount />
            <ReceiveInfo onOpen={onOpen} />
            <Flex flexDir="column">
              <TransferButtonGroup />
            </Flex>
            <Box display={{ base: 'block', lg: 'none' }}>{routeContentBottom}</Box>
          </Flex>
          <>{bridgeBottom}</>
        </Box>
        <Box display={{ base: 'none', lg: 'flex' }}>
          <TransferOverview routeContentBottom={routeContentBottom} />
        </Box>
        {isBase && (
          <RoutesModal
            title={formatMessage({ id: 'route.title.select.routes' })}
            isOpen={isOpen}
            onClose={onClose}
          >
            <TransferOverview />
          </RoutesModal>
        )}
      </Flex>
    </>
  );
}
