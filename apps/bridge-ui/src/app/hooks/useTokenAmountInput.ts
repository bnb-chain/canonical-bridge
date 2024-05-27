'use client';
import { useCallback, useState } from 'react';

export const useTokenAmountInput = () => {
  const [amount, setAmount] = useState<{ value: string }>({
    value: '',
  });

  const onChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (evt) => {
      setAmount({
        value: evt.target.value,
      });
    },
    []
  );

  return { amount, onChange };
};
