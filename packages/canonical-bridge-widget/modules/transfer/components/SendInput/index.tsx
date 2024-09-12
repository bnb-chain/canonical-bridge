import { Box, Flex, Input, useColorMode, useDisclosure } from '@bnb-chain/space';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setSendValue, setTransferActionInfo } from '@/modules/transfer/action';
// import { TokenBalance } from '@/modules/transfer/components/TokenBalance';
import { MaxLink } from '@/modules/transfer/components/SendInput/MaxLink';
import { TokenSelectButton } from '@/modules/transfer/components/SelectButton/TokenSelectButton';
import { SelectTokenModal } from '@/modules/transfer/components/SelectModal/SelectSourceModal/SelectTokenModal';
import { useSetSelectInfo } from '@/modules/transfer/hooks/useSetSelectInfo';
import { BridgeChain, BridgeToken } from '@/modules/bridges';
import { InputValidationMessage } from '@/modules/transfer/components/SendInput/InputValidationMessage';

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

export const SendInput: React.FC = () => {
  const { colorMode } = useColorMode();
  const dispatch = useAppDispatch();

  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const theme = useAppSelector((state) => state.theme.themeConfig);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const error = useAppSelector((state) => state.transfer.error);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const { setSelectInfo } = useSetSelectInfo();

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
    <Flex flexDir={'column'} gap={'12px'} position={'relative'}>
      <Flex flexDir={'row'} justifyContent={'space-between'}>
        <Box color={theme.colors[colorMode].input.title} fontSize={'14px'} fontWeight={400}>
          You Send
        </Box>
        <MaxLink />
      </Flex>
      <Flex
        flex={1}
        flexDir={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        p={'12px 16px'}
        h={'64px'}
        borderRadius={'8px'}
        border={`1px solid ${
          !!error ? theme.colors[colorMode].text.danger : theme.colors[colorMode].input.border
        }`}
        background={theme.colors[colorMode].input.background}
        position={'relative'}
      >
        <Input
          value={sendValue}
          color={theme.colors[colorMode].text.primary}
          fontSize={'24px'}
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
        <TokenSelectButton token={selectedToken} onClick={onOpen} />
      </Flex>
      <InputValidationMessage />
      <SelectTokenModal isOpen={isOpen} onClose={onClose} onSelect={onSelectSource} />
    </Flex>
  );
};
