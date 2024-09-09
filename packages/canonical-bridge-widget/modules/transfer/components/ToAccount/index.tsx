import {
  Flex,
  Box,
  Input,
  useColorMode,
  theme,
  FlexProps,
  useIntl,
  InputGroup,
  InputRightElement,
} from '@bnb-chain/space';
import { ChangeEvent, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import { setToAccount } from '@/modules/transfer/action';
import { ErrorIcon } from '@/core/components/icons/ErrorIcon';
// import { CorrectIcon } from '@/core/components/icons/CorrectIcon';

export function ToAccount(props: FlexProps) {
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const toAccount = useAppSelector((state) => state.transfer.toAccount);

  const timerRef = useRef<any>();
  const [inputValue, setInputValue] = useState(toAccount.address);
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setInputValue(value);

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      dispatch(
        setToAccount({
          address: value,
        }),
      );
    }, 500);
  };

  const isInvalid = !!toAccount.address;

  return (
    <Flex
      flexDirection="column"
      color={theme.colors[colorMode].text.tertiary}
      fontSize={'14px'}
      lineHeight={'16px'}
      fontWeight={400}
      {...props}
    >
      <Box>{formatMessage({ id: 'to.section.account.label' })}</Box>
      <InputGroup alignItems="center" mt={'12px'}>
        <Input
          isInvalid={isInvalid}
          size={'lg'}
          value={inputValue}
          placeholder={formatMessage({ id: 'to.section.account.placeholder' })}
          bg="transparent"
          onChange={onChange}
          _active={{}}
          _focusVisible={{}}
          _hover={{
            bg: 'transparent',
          }}
          _focus={{
            bg: 'transparent',
            boxShadow: `0 0 0 1px ${theme.colors[colorMode].support.brand[3]}`,
            borderColor: theme.colors[colorMode].support.brand[3],
          }}
          _invalid={{
            boxShadow: `0 0 0 1px ${theme.colors[colorMode].support.danger[3]}`,
            borderColor: theme.colors[colorMode].support.danger[3],
          }}
        />
        {isInvalid && (
          <InputRightElement h="100%" w="auto" pr={'16px'} pl={'8px'}>
            <ErrorIcon boxSize={'16px'} />
          </InputRightElement>
        )}
      </InputGroup>

      {isInvalid && (
        <Flex mt={'8px'} color={theme.colors[colorMode].support.danger[3]}>
          {formatMessage({ id: 'to.section.account.invalid' })}
        </Flex>
      )}
    </Flex>
  );
}
