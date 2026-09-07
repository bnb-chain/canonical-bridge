import { Flex, Typography, useColorMode, useDisclosure, useIntl, useTheme } from '@bnb-chain/space';

import { SelectButton } from '@/modules/transfer/components/SelectButton';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { SourceNetworkModal } from '@/modules/aggregator/components/SelectModal/SourceNetworkModal';
import { EventTypes, useAnalytics } from '@/core/analytics';

export function FromSection() {
  const { colorMode } = useColorMode();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { formatMessage } = useIntl();
  const { emit } = useAnalytics();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const theme = useTheme();

  return (
    <Flex
      className="bccb-widget-network-from"
      flexDir="column"
      gap={'8px'}
      w={'100%'}
      flex={1}
      h={'48px'}
    >
      <Flex
        className="bccb-widget-network-from-title"
        alignItems="center"
        justifyContent={'space-between'}
        display={{ base: 'flex', md: 'none' }}
      >
        <Typography variant="label" size={'md'} color={theme.colors[colorMode].text.placeholder}>
          {formatMessage({ id: 'from.section.title' })}
        </Typography>
      </Flex>

      <SelectButton
        isActive={isOpen}
        chain={fromChain}
        onClick={() => {
          onOpen();
          emit(EventTypes.CLICK_BRIDGE_FROM_DROPDOWN, null);
        }}
      />
      <SourceNetworkModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}
