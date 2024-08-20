import { FormErrorMessage, Input, InputGroup } from '@chakra-ui/react';
import { Meta } from '@storybook/react';
import { useEffect, useMemo, useState } from 'react';

import { FormControl } from '../../components/FormControl';
import type { Validation } from '../types';

import { useValidateTokenAmount } from '.';

const TOKEN_BNB = {
  symbol: 'BNB',
  decimals: 18,
};

export default {
  title: 'Hooks/useValidateTokenAmount',
  component: Input,
} as Meta;

export const ValidateTokenAmount = () => {
  const [isPristine, setIsPristine] = useState(true);
  const [amount, setAmount] = useState<{
    value: string;
    validation: Validation;
  }>({
    value: '',
    validation: {
      isValid: false,
    },
  });

  const validate = useValidateTokenAmount();

  useEffect(() => {
    if (!isPristine) {
      return;
    }
    setIsPristine(!amount.value);
  }, [amount.value, isPristine]);

  const isInvalid = useMemo(() => {
    return !isPristine && !!amount.validation && !amount.validation.isValid;
  }, [isPristine, amount.validation]);

  return (
    <FormControl isInvalid={isInvalid}>
      <InputGroup>
        <Input
          value={amount.value}
          onChange={(evt) =>
            setAmount({
              value: evt.target.value,
              validation: validate({
                value: evt.target.value,
                token: TOKEN_BNB,
                decimals: 18,
                minimum: '0',
                maximum: '1',
              }),
            })
          }
        />
      </InputGroup>
      <FormErrorMessage>{amount.validation?.errors?.[0]}</FormErrorMessage>
    </FormControl>
  );
};
