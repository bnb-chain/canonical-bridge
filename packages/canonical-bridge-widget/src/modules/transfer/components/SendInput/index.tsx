import { Box, Flex, Input, useColorMode, useDisclosure, useIntl, useTheme } from '@bnb-chain/space';
import { useEffect, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setSendValue } from '@/modules/transfer/action';
import { MaxLink } from '@/modules/transfer/components/SendInput/MaxLink';
import { TokenSelectButton } from '@/modules/transfer/components/SelectButton/TokenSelectButton';
import { InputValidationMessage } from '@/modules/transfer/components/SendInput/InputValidationMessage';
import { useDebounce } from '@/core/hooks/useDebounce';
import { DEBOUNCE_DELAY } from '@/core/constants';
import { reportEvent } from '@/core/utils/gtm';
import { ChooseTokenModal } from '@/modules/aggregator/components/SelectModal/ChooseTokenModal';

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
  const { formatMessage } = useIntl();
  const timerRef = useRef<any>();
  const theme = useTheme();

  const [isFocused, setIsFocused] = useState(false);

  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const error = useAppSelector((state) => state.transfer.error);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const debouncedSendValue = useDebounce(sendValue, DEBOUNCE_DELAY);

  const onChangeSendValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.trim() ?? 0;
    // const min = 0.00000001;
    value = value.replace('。', '.').replace(',', '.');
    const decimalLength = value.split('.')[1]?.length || 0;
    // Equal to zero, less than 0.00000001
    if (value.split('.').length > 2 || decimalLength > 18) return;
    if (value === '.') value = '0.';

    const decimalStart = /(?:^\.(\d+))|(?:^0(\d+))/g;

    if (decimalStart.test(value)) {
      value.replace(decimalStart, (...args) => {
        return args[1] || args[2] ? '0.' + (args[1] || args[2]) : '';
      });
    }
    const finalValue = !isNaN(Number(value)) ? value : '0';
    dispatch(setSendValue(finalValue));

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      reportEvent({
        id: 'input_bridge_amount',
        params: {
          item_name: fromChain?.name,
          token: selectedToken?.displaySymbol,
          value: finalValue,
        },
      });
    }, DEBOUNCE_DELAY);
  };

  useEffect(() => {
    if (isGlobalFeeLoading && sendValue === debouncedSendValue) {
      setIsFocused(false);
    }
  }, [isGlobalFeeLoading, debouncedSendValue, sendValue]);

  return (
    <Flex flexDir={'column'} position={'relative'}>
      <Flex flexDir={'row'} justifyContent={'space-between'}>
        <Box
          color={theme.colors[colorMode].input.title}
          fontSize={'14px'}
          fontWeight={400}
          lineHeight={'16px'}
        >
          {formatMessage({ id: 'you.send.title' })}
        </Box>
        <MaxLink />
      </Flex>
      <Flex
        flex={1}
        mt={'12px'}
        flexDir={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        p={'12px 16px'}
        h={'64px'}
        borderRadius={'8px'}
        border={'1px solid'}
        borderColor={`${
          !!error?.text
            ? theme.colors[colorMode].text.danger
            : isFocused
            ? theme.colors[colorMode].text.brand
            : theme.colors[colorMode].input.border.default
        }`}
        boxShadow={
          !!error?.text
            ? `0 0 0 1px ${theme.colors[colorMode].text.danger}`
            : isFocused
            ? `0 0 0 1px ${theme.colors[colorMode].text.brand}`
            : 'none'
        }
        background={theme.colors[colorMode].input.background}
        position={'relative'}
        _hover={{
          outline: '1px solid',
          outlineColor: !!error?.text
            ? theme.colors[colorMode].text.danger
            : isFocused
            ? theme.colors[colorMode].text.brand
            : theme.colors[colorMode].input.border.hover,
          border: `1px solid ${
            !!error?.text
              ? theme.colors[colorMode].text.danger
              : isFocused
              ? theme.colors[colorMode].text.brand
              : theme.colors[colorMode].input.border.hover
          }`,
        }}
      >
        <Input
          inputMode={'decimal'}
          value={sendValue}
          color={theme.colors[colorMode].text.primary}
          fontSize={'24px'}
          onChange={onChangeSendValue}
          placeholder={'0.0'}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          border={'none'}
          disabled={!selectedToken || (isGlobalFeeLoading && sendValue === debouncedSendValue)}
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
          // pattern="[0-9]*"
          step={'0.000000001'}
          onWheel={(e: any) => e.target.blur()}
        />
        <TokenSelectButton
          token={selectedToken}
          onClick={() => {
            reportEvent({
              id: 'click_bridge_tokenDropdown',
            });
            onOpen();
          }}
        />
      </Flex>
      <InputValidationMessage />

      <ChooseTokenModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};
