import {
  Flex,
  Typography,
  useBreakpointValue,
  useColorMode,
  useDisclosure,
  useIntl,
  useTheme,
} from '@bnb-chain/space';

import { SelectButton } from '@/modules/transfer/components/SelectButton';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { SourceNetworkModal } from '@/modules/transfer/components/SelectModal/SourceNetworkModal';

export function FromSection() {
  const { colorMode } = useColorMode();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const isBase = useBreakpointValue({ base: true, md: false }) ?? false;
  const { formatMessage } = useIntl();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const theme = useTheme();

  return (
    <Flex flexDir="column" gap={'12px'} w={'100%'} flex={1} h={'64px'}>
      {isBase ? (
        <Flex alignItems="center" justifyContent={'space-between'}>
          <Typography
            variant="body"
            lineHeight={'16px'}
            size={'sm'}
            color={theme.colors[colorMode].text.placeholder}
          >
            {formatMessage({ id: 'from.section.title' })}
          </Typography>
        </Flex>
      ) : null}
      <Flex
        flexDir="column"
        justifyContent="space-between"
        borderRadius={'8px'}
        gap={'8px'}
        position={'relative'}
      >
        <Flex
          flexDir="column"
          justifyContent="space-between"
          borderRadius={'8px'}
          border={`1px solid ${theme.colors[colorMode].border['3']}`}
        >
          <SelectButton network={fromChain} onClick={onOpen} />
        </Flex>
      </Flex>

      <SourceNetworkModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}
