import { Box, Flex, Typography, useColorMode, useTheme } from '@bnb-chain/space';

import { TransferButtonGroup } from '@/modules/transfer/components/TransferButtonGroup';
import { NetWorkSection } from '@/modules/transfer/components/NetWorkSection';
import { SendInput } from '@/modules/transfer/components/SendInput';
import { ReceiveInfo } from '@/modules/transfer/components/ReceiveInfo';
import { useDefaultSelectedInfo } from '@/modules/aggregator/hooks/useDefaultSelectedInfo';
import { useBridgeConfig } from '@/CanonicalBridgeProvider';
import { ToAccount } from '@/modules/transfer/components/ToAccount';
import { SvgDefs } from '@/core/components/icons/defs.tsx';
import { useAppDispatch } from '@/modules/store/StoreProvider';
import { setIsRoutesModalOpen } from '@/modules/transfer/action';

export function BridgeTransfer() {
  const { colorMode } = useColorMode();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  useDefaultSelectedInfo();

  const { appearance, routeContentBottom } = useBridgeConfig();

  return (
    <>
      <SvgDefs />
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
        <ReceiveInfo onOpen={() => dispatch(setIsRoutesModalOpen(true))} />
        <Flex flexDir="column">
          <TransferButtonGroup />
        </Flex>
        {routeContentBottom && (
          <Box display={{ base: 'block', lg: 'none' }}>{routeContentBottom}</Box>
        )}
      </Flex>
    </>
  );
}