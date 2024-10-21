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
import { useEffect } from 'react';

import { setIsToAddressChecked, setToAccount } from '@/modules/transfer/action';
import { useTronTransferInfo } from '@/modules/transfer/hooks/tron/useTronTransferInfo';
import { ErrorIcon } from '@/core/components/icons/ErrorIcon';
import { CorrectIcon } from '@/core/components/icons/CorrectIcon';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { ConfirmCheckbox } from '@/core/components/ConfirmCheckbox';

export function ToAccount(props: FlexProps) {
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const [isChecked, setIsChecked] = useState(false);

  const toAccount = useAppSelector((state) => state.transfer.toAccount);
  const toChain = useAppSelector((state) => state.transfer.toChain);

  const { isTronTransfer, isAvailableAccount } = useTronTransferInfo();

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

  useEffect(() => {
    // Clear input value when toAccount is cleared
    if (!toAccount.address) setInputValue('');
  }, [toAccount.address]);

  if (!isTronTransfer) {
    return null;
  }

  const isInvalid = !isAvailableAccount && !!toAccount.address;

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked === true) {
      setIsChecked(true);
      dispatch(setIsToAddressChecked(true));
    } else {
      setIsChecked(false);
      dispatch(setIsToAddressChecked(false));
    }
  };

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
          placeholder={formatMessage(
            { id: 'to.section.account.placeholder' },
            { network: toChain?.name ?? '' },
          )}
          bg="transparent"
          onChange={onChange}
          _active={{}}
          _focusVisible={{}}
          _hover={{
            bg: 'transparent',
          }}
          _focus={{
            bg: 'transparent',
            boxShadow: `0 0 0 1px ${theme.colors[colorMode].text.brand}`,
            borderColor: theme.colors[colorMode].text.brand,
          }}
          _invalid={{
            boxShadow: `0 0 0 1px ${theme.colors[colorMode].text.danger}`,
            borderColor: theme.colors[colorMode].text.danger,
          }}
        />
        {(isInvalid || isAvailableAccount) && (
          <InputRightElement h="100%" w="auto" pr={'16px'} pl={'8px'}>
            {isInvalid && <ErrorIcon boxSize={'16px'} />}
            {isAvailableAccount && <CorrectIcon boxSize={'16px'} />}
          </InputRightElement>
        )}
      </InputGroup>

      {isInvalid && (
        <Flex mt={'8px'} color={theme.colors[colorMode].text.danger}>
          {formatMessage({ id: 'to.section.account.invalid' })}
        </Flex>
      )}

      <ConfirmCheckbox
        isChecked={isChecked}
        onChange={onCheckboxChange}
        borderRadius={'2px'}
        mt={'12px'}
        mb={'8px'}
        justifyItems={'flex-start'}
      >
        {formatMessage({ id: 'to.section.confirm.text' })}
      </ConfirmCheckbox>
    </Flex>
  );
}
