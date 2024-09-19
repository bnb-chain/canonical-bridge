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
import { SelectDestinationModal } from '@/modules/transfer/components/SelectModal/SelectDestinationModal';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setToChain } from '@/modules/transfer/action';
import { BridgeChain } from '@/modules/bridges';
import { useSetSelectInfo } from '@/modules/transfer/hooks/useSetSelectInfo';

export function ToSection() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const { setSelectInfo } = useSetSelectInfo();
  const isBase = useBreakpointValue({ base: true, md: false }) ?? false;
  const { colorMode } = useColorMode();

  const toChain = useAppSelector((state) => state.transfer.toChain);

  const onSelectSource = (chain: BridgeChain) => {
    setSelectInfo({
      direction: 'to',
      toChainId: chain.id,
    });

    dispatch(setToChain(chain));
  };

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

      <SelectDestinationModal isOpen={isOpen} onClose={onClose} onSelect={onSelectSource} />
    </>
  );
}
