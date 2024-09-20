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

interface TransferPageProps {
  routeContentBottom?: React.ReactNode;
}

export function TransferPage({ routeContentBottom }: TransferPageProps) {
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const isBase = useBreakpointValue({ base: true, lg: false }) ?? false;

  useDefaultSelectedInfo();

  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Flex
      flexDir={['column', 'column', 'column', 'row']}
      gap={[]}
      mb={'160px'}
      alignItems={'flex-start'}
    >
      <Flex
        flexDir="column"
        background={theme.colors[colorMode].background.main}
        color={theme.colors[colorMode].text.primary}
        boxShadow={`0 ${'24px'} ${'64px'} 0 rgba(0, 0, 0, 0.48)`}
        borderRadius={'24px'}
        px={'24px'}
        py={'32px'}
        w={'588px'}
        gap={'24px'}
        position="relative"
      >
        <Box
          as="h1"
          mb={'8px'}
          fontSize={'20px'}
          fontWeight={500}
          textAlign={'center'}
          borderBottom={`1px solid ${theme.colors[colorMode].border[2]}`}
          pb={'24px'}
        >
          {formatMessage({ id: 'main.title' })}
        </Box>
        <NetWorkSection />
        <SendInput />
        <ReceiveInfo onOpen={onOpen} />
        <Flex flexDir="column">
          <TransferButtonGroup />
        </Flex>
      </Flex>
      {!isBase ? (
        <TransferOverview routeContentBottom={routeContentBottom} />
      ) : (
        <RoutesModal
          title={formatMessage({ id: 'route.title.select.routes' })}
          isOpen={isOpen}
          onClose={onClose}
        >
          <TransferOverview routeContentBottom={routeContentBottom} />
        </RoutesModal>
      )}
    </Flex>
  );
}
