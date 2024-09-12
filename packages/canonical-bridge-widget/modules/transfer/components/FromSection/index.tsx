import { Flex, Typography, useColorMode, useDisclosure, useIntl } from '@bnb-chain/space';

import { setTransferActionInfo } from '@/modules/transfer/action';
import { ExternalAddress } from '@/modules/transfer/components/ExternalTokenAddress';
import { ErrorMsg } from '@/modules/transfer/components/TokenBalance';
import { SelectButton } from '@/modules/transfer/components/SelectButton';
import { SelectSourceModal } from '@/modules/transfer/components/SelectModal/SelectSourceModal';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { BridgeChain, BridgeToken, formatTokenUrl } from '@/modules/bridges';
import { useSetSelectInfo } from '@/modules/transfer/hooks/useSetSelectInfo';

export function FromSection() {
  const dispatch = useAppDispatch();
  const { formatMessage } = useIntl();

  const { colorMode } = useColorMode();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { setSelectInfo } = useSetSelectInfo();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const error = useAppSelector((state) => state.transfer.error);
  const theme = useAppSelector((state) => state.theme.themeConfig);

  const onSelectSource = (chain: BridgeChain, token?: BridgeToken) => {
    setSelectInfo({
      direction: 'from',
      fromChainId: chain.id,
      tokenSymbol: token?.symbol,
      tokenAddress: token?.address,
    });

    dispatch(setTransferActionInfo(undefined));
  };

  return (
    <Flex flexDir="column" gap={'12px'} mt={'24px'}>
      <Flex alignItems="center" justifyContent={'space-between'}>
        <Typography
          variant="body"
          size={'sm'}
          lineHeight={'16px'}
          color={theme.colors[colorMode].text.placeholder}
        >
          {formatMessage({ id: 'from.section.title' })}
        </Typography>
        {selectedToken?.address && fromChain && (
          <ExternalAddress
            address={selectedToken.address}
            tokenUrl={formatTokenUrl(fromChain?.tokenUrlPattern, selectedToken?.address)}
          />
        )}
      </Flex>
      <Flex
        flexDir="column"
        justifyContent="space-between"
        borderRadius={'16px'}
        gap={'8px'}
        position={'relative'}
      >
        <Flex
          flexDir="column"
          justifyContent="space-between"
          borderRadius={'16px'}
          border={`1px solid ${
            !!error ? theme.colors[colorMode].text.danger : theme.colors[colorMode].border['3']
          }`}
          p={'8px'}
          gap={'8px'}
        >
          <Flex gap={'24px'}>
            <SelectButton network={fromChain} token={selectedToken} onClick={onOpen} />
            <Flex flex={1} flexDir={'column'} justifyContent={'center'}></Flex>
          </Flex>
        </Flex>
        {error ? (
          <ErrorMsg position={'absolute'} top={`calc(100% + ${'8px'})`}>
            {error}
          </ErrorMsg>
        ) : null}
      </Flex>

      <SelectSourceModal isOpen={isOpen} onClose={onClose} onSelect={onSelectSource} />
    </Flex>
  );
}
