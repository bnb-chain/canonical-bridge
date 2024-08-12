import {
  Flex,
  Input,
  Typography,
  theme,
  useColorMode,
  useDisclosure,
  useIntl,
} from '@bnb-chain/space';

import { setSendValue, setTransferActionInfo } from '@/modules/transfer/action';
import { ExternalAddress } from '@/modules/transfer/components/ExternalTokenAddress';
import { ErrorMsg, TokenBalance } from '@/modules/transfer/components/TokenBalance';
import { SelectButton } from '@/modules/transfer/components/SelectButton';
import { SelectSourceModal } from '@/modules/transfer/components/SelectModal/SelectSourceModal';
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import { BridgeChain, BridgeToken, useSetSelectInfo } from '@/modules/bridges/main';

const handleKeyPress = (e: React.KeyboardEvent) => {
  // only allow number and decimal
  if (
    e.key !== '1' &&
    e.key !== '2' &&
    e.key !== '3' &&
    e.key !== '4' &&
    e.key !== '5' &&
    e.key !== '6' &&
    e.key !== '7' &&
    e.key !== '8' &&
    e.key !== '9' &&
    e.key !== '0' &&
    e.key !== '.' &&
    e.key !== ',' &&
    e.key !== '。' &&
    e.key !== 'ArrowLeft' &&
    e.key !== 'ArrowRight' &&
    e.key !== 'Backspace'
  ) {
    e.preventDefault();
  }
};

export function FromSection() {
  const dispatch = useAppDispatch();
  const { formatMessage } = useIntl();

  const { colorMode } = useColorMode();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { setSelectInfo } = useSetSelectInfo();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const error = useAppSelector((state) => state.transfer.error);

  const onChangeSendValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.trim() ?? 0;
    const min = 0.00000001;
    value = value.replace('。', '.').replace(',', '.');
    const decimalLength = value.split('.')[1]?.length || 0;
    // Equal to zero, less than 0.00000001
    if (
      (Number(value) !== 0 && Number(value) < min) ||
      value.split('.').length > 2 ||
      decimalLength > 18
    )
      return;
    if (value === '.') value = '0.';

    const decimalStart = /(?:^\.(\d+))|(?:^0(\d+))/g;

    if (decimalStart.test(value)) {
      value.replace(decimalStart, (...args) => {
        return args[1] || args[2] ? '0.' + (args[1] || args[2]) : '';
      });
    }
    if (!isNaN(Number(value))) {
      dispatch(setSendValue(value));
    } else {
      dispatch(setSendValue('0'));
    }
  };

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
    <Flex flexDir="column" gap={theme.sizes['3']}>
      <Flex alignItems="center" justifyContent={'space-between'}>
        <Typography
          variant="body"
          size={'sm'}
          lineHeight={theme.sizes['4']}
          color={theme.colors[colorMode].text.placeholder}
        >
          {formatMessage({ id: 'from.section.title' })}
        </Typography>
        {selectedToken && fromChain && (
          <ExternalAddress address={selectedToken.address} chain_id={fromChain.id} />
        )}
      </Flex>
      <Flex
        flexDir="column"
        justifyContent="space-between"
        borderRadius={theme.sizes['4']}
        gap={theme.sizes['2']}
        position={'relative'}
      >
        <Flex
          flexDir="column"
          justifyContent="space-between"
          borderRadius={theme.sizes['4']}
          border={`1px solid ${
            !!error
              ? theme.colors[colorMode].support.danger['3']
              : theme.colors[colorMode].border['3']
          }`}
          p={theme.sizes['2']}
          gap={theme.sizes['2']}
        >
          <Flex gap={theme.sizes['6']}>
            <SelectButton network={fromChain} token={selectedToken} onClick={onOpen} />
            <Flex flex={1} flexDir={'column'} justifyContent={'center'}>
              <Input
                value={sendValue}
                color={theme.colors[colorMode].text.primary}
                fontSize={theme.sizes['6']}
                onChange={onChangeSendValue}
                placeholder={'0.0'}
                border={'none'}
                disabled={!selectedToken}
                _hover={{
                  border: 'none',
                  background: 'none',
                }}
                _focus={{
                  border: 'none',
                  background: 'none',
                }}
                _focusVisible={{
                  border: 'none',
                  background: 'none',
                }}
                _disabled={{
                  border: 'none',
                  background: 'none',
                }}
                px={0}
                background={'none'}
                borderRadius={0}
                onKeyDown={handleKeyPress}
                pattern="[0-9]*"
                step={'0.000000001'}
                onWheel={(e: any) => e.target.blur()}
              />
              <TokenBalance />
            </Flex>
          </Flex>
        </Flex>
        {error ? (
          <ErrorMsg position={'absolute'} top={`calc(100% + ${theme.sizes['2']})`}>
            {error}
          </ErrorMsg>
        ) : null}
      </Flex>

      <SelectSourceModal isOpen={isOpen} onClose={onClose} onSelect={onSelectSource} />
    </Flex>
  );
}
