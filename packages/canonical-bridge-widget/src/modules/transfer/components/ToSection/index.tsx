import {
  Flex,
  Typography,
  theme,
  useBreakpointValue,
  useColorMode,
  useDisclosure,
  useIntl,
} from '@bnb-chain/space';

import { SelectButton } from '@/modules/transfer/components/SelectButton';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { DestinationNetworkModal } from '@/modules/transfer/components/SelectModal/DestinationNetworkModal';

export function ToSection() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { formatMessage } = useIntl();
  const isBase = useBreakpointValue({ base: true, md: false }) ?? false;
  const { colorMode } = useColorMode();

  const toChain = useAppSelector((state) => state.transfer.toChain);

  return (
    <>
      <Flex flexDir="column" gap={'12px'} w={'100%'} flex={1} h={'64px'}>
        {isBase ? (
          <Flex alignItems="center" justifyContent={'space-between'}>
            <Typography
              variant="body"
              lineHeight={'16px'}
              size={'sm'}
              color={theme.colors[colorMode].text.placeholder}
            >
              {formatMessage({ id: 'to.section.title' })}
            </Typography>
          </Flex>
        ) : null}
        <Flex
          flexDir="column"
          justifyContent="space-between"
          borderRadius={'8px'}
          border={`1px solid ${theme.colors[colorMode].border['3']}`}
        >
          <SelectButton network={toChain} onClick={onOpen} />
        </Flex>
      </Flex>

      <DestinationNetworkModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
