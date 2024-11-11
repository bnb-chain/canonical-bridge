import {
  Flex,
  Box,
  Input,
  useColorMode,
  useTheme,
  FlexProps,
  useIntl,
  InputGroup,
} from '@bnb-chain/space';
import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { useEffect } from 'react';
import { useBytecode } from 'wagmi';

import { setIsToAddressChecked, setToAccount } from '@/modules/transfer/action';
import { useTronTransferInfo } from '@/modules/transfer/hooks/tron/useTronTransferInfo';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { useTronContract } from '@/modules/aggregator/adapters/meson/hooks/useTronContract';
import { useSolanaTransferInfo } from '@/modules/transfer/hooks/solana/useSolanaTransferInfo';
import { ToAccountCheckBox } from '@/core/components/icons/ConfirmCheckIcon';

export function ToAccount(props: FlexProps) {
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const [isChecked, setIsChecked] = useState(false);

  const toAccount = useAppSelector((state) => state.transfer.toAccount);
  const toChain = useAppSelector((state) => state.transfer.toChain);

  const { isTronTransfer, isTronAvailableToAccount } = useTronTransferInfo();
  const { isTronContract } = useTronContract();
  const { data: evmBytecode } = useBytecode({
    address: toAccount.address as `0x${string}`,
    chainId: toChain?.id,
  });

  const { isSolanaTransfer, isSolanaAvailableToAccount } = useSolanaTransferInfo();

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

  const { isInvalid, isAvailableAccount } = useMemo(() => {
    if (isTronTransfer) {
      return {
        isInvalid:
          (!isTronAvailableToAccount && !!toAccount.address) ||
          isTronContract === true ||
          !!evmBytecode,
        isAvailableAccount: isTronAvailableToAccount,
      };
    }

    if (isSolanaTransfer) {
      return {
        isInvalid: !!toAccount.address && !isSolanaAvailableToAccount,
        isAvailableAccount: isSolanaAvailableToAccount,
      };
    }

    return {
      isInvalid: false,
      isAvailableAccount: false,
    };
  }, [
    isTronTransfer,
    isSolanaTransfer,
    isTronAvailableToAccount,
    toAccount.address,
    isTronContract,
    evmBytecode,
    isSolanaAvailableToAccount,
  ]);

  if (!isTronTransfer && !isSolanaTransfer) {
    return null;
  }

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
      className="bccb-widget-to-account-container"
      flexDirection="column"
      color={theme.colors[colorMode].text.tertiary}
      fontSize={'14px'}
      lineHeight={'16px'}
      fontWeight={400}
      {...props}
    >
      <Box className="bccb-widget-to-account-title">
        {formatMessage({ id: 'to.section.account.label' })}
      </Box>
      <InputGroup
        className="bccb-widget-to-account-input"
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
      </InputGroup>

      {isInvalid && (
        <Flex
          className="bccb-widget-to-account-input-error"
          mt={'8px'}
          fontSize={'14px'}
          color={theme.colors[colorMode].text.danger}
        >
          {formatMessage({ id: 'to.section.account.invalid' })}
        </Flex>
      )}

      <Flex
        className="bccb-widget-to-account-confirm"
        flexDir={'row'}
        mt={'12px'}
        mb={'8px'}
        ml={'-6px'}
        gap={'2px'}
      >
        <ToAccountCheckBox onClick={toggleChecked} isChecked={isChecked} />
        <Box>{formatMessage({ id: 'to.section.confirm.text' })}</Box>
      </Flex>
    </Flex>
  );
}
