import {
  Flex,
  Typography,
  useBreakpointValue,
  useColorMode,
  useDisclosure,
  useIntl,
  useTheme,
} from '@bnb-chain/space';

import { setTransferActionInfo } from '@/modules/transfer/action';
import { SelectButton } from '@/modules/transfer/components/SelectButton';
import { SelectSourceModal } from '@/modules/transfer/components/SelectModal/SelectSourceModal';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { useSetSelectInfo } from '@/modules/transfer/hooks/useSetSelectInfo';
import { IBridgeChain, IBridgeToken } from '@/modules/aggregator/types';

export function FromSection() {
  const dispatch = useAppDispatch();

  const { colorMode } = useColorMode();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { setSelectInfo } = useSetSelectInfo();
  const isBase = useBreakpointValue({ base: true, md: false }) ?? false;
  const { formatMessage } = useIntl();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const theme = useTheme();

  const onSelectSource = (chain: IBridgeChain, token?: IBridgeToken) => {
    setSelectInfo({
      direction: 'from',
      fromChainId: chain.id,
      tokenSymbol: token?.symbol,
      tokenAddress: token?.address,
    });

    dispatch(setTransferActionInfo(undefined));
  };

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

      <SelectSourceModal isOpen={isOpen} onClose={onClose} onSelect={onSelectSource} />
    </Flex>
  );
}
