import { Flex, Typography, theme, useColorMode, useDisclosure, useIntl } from '@bnb-chain/space';

import { SelectButton } from '@/modules/transfer/components/SelectButton';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { reportEvent } from '@/core/utils/gtm';
import { DestinationNetworkModal } from '@/modules/aggregator/components/SelectModal/DestinationNetworkModal';

export function ToSection() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { formatMessage } = useIntl();
  const { colorMode } = useColorMode();

  const toChain = useAppSelector((state) => state.transfer.toChain);

  return (
    <Flex
      className="bccb-widget-network-to"
      flexDir="column"
      gap={'12px'}
      w={'100%'}
      flex={1}
      h={'64px'}
    >
      <Flex
        className="bccb-widget-network-title"
        alignItems="center"
        justifyContent={'space-between'}
        display={{ base: 'flex', md: 'none' }}
      >
        <Typography
          variant="body"
          lineHeight={'16px'}
          size={'sm'}
          color={theme.colors[colorMode].text.placeholder}
        >
          {formatMessage({ id: 'to.section.title' })}
        </Typography>
      </Flex>

      <SelectButton
        isActive={isOpen}
        chain={toChain}
        onClick={() => {
          onOpen();
          reportEvent({
            id: 'click_bridge_toDropdown',
          });
        }}
      />
      <DestinationNetworkModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}
