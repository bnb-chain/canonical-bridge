import { CloseIcon } from '@bnb-chain/icons';
import {
  Button,
  InputGroupProps,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  theme,
  useColorMode,
} from '@bnb-chain/space';
import { ChangeEvent, useRef, useState } from 'react';

import { SearchIcon } from '@/core/components/icons/SearchIcon';

interface SearchInputProps extends Omit<InputGroupProps, 'onChange'> {
  placeholder: string;
  onChange: (value: string) => void;
  isDisabled?: boolean;
}

export function SearchInput(props: SearchInputProps) {
  const { placeholder, isDisabled = false, onChange, ...restProps } = props;

  const { colorMode } = useColorMode();

  const [value, setValue] = useState('');
  const timerRef = useRef<any>();

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.trim();
    setValue(newValue);

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(newValue);
    }, 500);
  };

  const onClear = () => {
    setValue('');
    onChange('');
  };

  return (
    <InputGroup {...restProps}>
      <InputLeftElement
        justifyContent="flex-end"
        pr={'8px'}
        color={theme.colors[colorMode].text.tertiary}
      >
        <SearchIcon />
      </InputLeftElement>

      <Input
        value={value}
        fontWeight={theme.fontWeights[400]}
        placeholder={placeholder}
        onChange={onChangeInput}
        maxLength={64}
        isDisabled={isDisabled}
      />

      {value && (
        <InputRightElement
          justifyContent="flex-start"
          pl={'8px'}
          color={theme.colors[colorMode].text.tertiary}
        >
          <Button
            variant="subtle"
            boxSize={'16px'}
            borderRadius="full"
            minW={0}
            p={0}
            onClick={onClear}
          >
            <CloseIcon boxSize="11px" />
          </Button>
        </InputRightElement>
      )}
    </InputGroup>
  );
}
