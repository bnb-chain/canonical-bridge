import {
  Flex,
  Box,
  Input,
  useColorMode,
  useTheme,
  FlexProps,
  useIntl,
  InputGroup,
  InputRightElement,
} from '@bnb-chain/space';
import { ChangeEvent, useRef, useState } from 'react';
import { useEffect } from 'react';
import { useBytecode } from 'wagmi';

import { setIsToAddressChecked, setToAccount } from '@/modules/transfer/action';
import { useTronTransferInfo } from '@/modules/transfer/hooks/tron/useTronTransferInfo';
import { ErrorIcon } from '@/core/components/icons/ErrorIcon';
import { CorrectIcon } from '@/core/components/icons/CorrectIcon';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { useTronContract } from '@/modules/aggregator/adapters/meson/hooks/useTronContract';
import { ToAccountCheckBox } from '@/core/components/icons/ConfirmCheckIcon';

export function ToAccount(props: FlexProps) {
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const [isChecked, setIsChecked] = useState(false);

  const toAccount = useAppSelector((state) => state.transfer.toAccount);
  const toChain = useAppSelector((state) => state.transfer.toChain);

  const { isTronTransfer, isAvailableAccount } = useTronTransferInfo();
  const { isTronContract } = useTronContract();
  const { data: evmBytecode } = useBytecode({
    address: toAccount.address as `0x${string}`,
    chainId: toChain?.id,
  });

  const timerRef = useRef<any>();
  const [inputValue, setInputValue] = useState(toAccount.address);
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setInputValue(value);

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
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

  const isInvalid =
    (!isAvailableAccount && !!toAccount.address) || isTronContract === true || !!evmBytecode;

  const toggleChecked = () => {
    if (isChecked) {
      setIsChecked(false);
      dispatch(setIsToAddressChecked(false));
    } else {
      setIsChecked(true);
      dispatch(setIsToAddressChecked(true));
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
      <InputGroup
        alignItems="center"
        mt={'12px'}
        _hover={{
          outline: '2px solid',
          outlineColor: theme.colors[colorMode].input.border.hover,
          borderRadius: '8px',
        }}
      >
        <Input
          isInvalid={isInvalid}
          background={theme.colors[colorMode].input.background}
          borderColor={theme.colors[colorMode].input.border.default}
          size={'lg'}
          value={inputValue}
          placeholder={formatMessage(
            { id: 'to.section.account.placeholder' },
            { network: toChain?.name ?? '' },
          )}
          onChange={onChange}
          _active={{}}
          _focusVisible={{}}
          _hover={{
            borderColor: isInvalid
              ? theme.colors[colorMode].text.danger
              : theme.colors[colorMode].input.border.hover,
          }}
          _focus={{
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
            {isAvailableAccount && !isInvalid && <CorrectIcon boxSize={'16px'} />}
          </InputRightElement>
        )}
      </InputGroup>

      {isInvalid && (
        <Flex mt={'8px'} fontSize={'14px'} color={theme.colors[colorMode].text.danger}>
          {formatMessage({ id: 'to.section.account.invalid' })}
        </Flex>
      )}

      <Flex flexDir={'row'} mt={'12px'} mb={'8px'} ml={'-6px'} gap={'2px'}>
        <ToAccountCheckBox onClick={toggleChecked} isChecked={isChecked} />
        <Box>{formatMessage({ id: 'to.section.confirm.text' })}</Box>
      </Flex>
    </Flex>
  );
}
