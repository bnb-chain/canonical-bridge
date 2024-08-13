import { BNBChainIcon } from '@bnb-chain/icons';
import {
  Button,
  ComponentWithAs,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement,
  Skeleton,
  StackProps,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import { ComponentStory, Meta } from '@storybook/react';
import { useEffect, useMemo, useState } from 'react';

import { useValidateURL, Validation } from '../../hooks';
import { theme } from '../../modules/theme';
import { FormControl, FormWarningMessage } from '../FormControl';

const INPUT_SIZES = ['sm', 'md', 'lg', 'xl'] as const;

export default {
  title: 'Components/Atoms/Input',
  component: Input,
} as Meta;

const Stack = (props: StackProps) => {
  return <VStack spacing={theme.sizes['8']} {...props} />;
};

const Template: ComponentStory<typeof Input> = () => {
  return (
    <InputGroup>
      <Input placeholder="Placeholder" />
    </InputGroup>
  );
};

export const Default: ComponentStory<ComponentWithAs<'input', InputProps>> = Template.bind({});

export const Sizes = () => {
  return (
    <Stack>
      {INPUT_SIZES.map((it) => {
        return (
          <InputGroup key={it}>
            <Input size={it} placeholder={it} />
          </InputGroup>
        );
      })}
    </Stack>
  );
};

export const States = () => {
  return (
    <Stack>
      <FormControl isDisabled>
        <FormLabel>Disabled Input</FormLabel>
        <InputGroup>
          <Input placeholder="Placeholder" />
        </InputGroup>
        <FormHelperText>Helper text.</FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>Loading Input</FormLabel>
        <InputGroup>
          <Skeleton w="100%">
            <Input />
          </Skeleton>
        </InputGroup>
        <Skeleton w={theme.sizes['50']}>
          <FormHelperText>Helper text.</FormHelperText>
        </Skeleton>
      </FormControl>

      <FormControl isWarning>
        <FormLabel>Input With Warning</FormLabel>
        <InputGroup>
          <Input />
        </InputGroup>
        <FormHelperText>Helper text.</FormHelperText>
        <FormWarningMessage>Warning message.</FormWarningMessage>
      </FormControl>

      <FormControl isInvalid>
        <FormLabel>Input With Error</FormLabel>
        <InputGroup>
          <Input />
        </InputGroup>
        <FormHelperText>Helper text.</FormHelperText>
        <FormErrorMessage>Error message.</FormErrorMessage>
      </FormControl>
    </Stack>
  );
};

export const WithLeftElement = () => {
  const { colorMode } = useColorMode();

  return (
    <Stack color={theme.colors[colorMode].text.placeholder}>
      <InputGroup>
        <InputLeftElement h="100%" w={theme.sizes['10']}>
          <BNBChainIcon fontSize={theme.sizes['4']} />
        </InputLeftElement>
        <Input size="md" placeholder="md" pl={theme.sizes['10']} />
      </InputGroup>
      <InputGroup>
        <InputLeftElement h="100%" w={theme.sizes['12']}>
          <BNBChainIcon fontSize={theme.sizes['5']} />
        </InputLeftElement>
        <Input size="lg" placeholder="lg" pl={theme.sizes['12']} />
      </InputGroup>
      <InputGroup>
        <InputLeftElement h="100%" w={theme.sizes['14']}>
          <BNBChainIcon fontSize={theme.sizes['6']} />
        </InputLeftElement>
        <Input size="xl" placeholder="xl" pl={theme.sizes['14']} />
      </InputGroup>
    </Stack>
  );
};

export const WithRightElement = () => {
  return (
    <Stack>
      <InputGroup>
        <Input size="md" placeholder="md" pr={theme.sizes['12']} />
        <InputRightElement w="min-content" h={theme.sizes['10']} mr={theme.sizes['2']}>
          <Button size="xs">xs</Button>
        </InputRightElement>
      </InputGroup>
      <InputGroup>
        <Input size="lg" placeholder="lg" pr={theme.sizes['14']} />
        <InputRightElement w="min-content" h={theme.sizes['12']} mr={theme.sizes['2']}>
          <Button size="sm">sm</Button>
        </InputRightElement>
      </InputGroup>
      <InputGroup>
        <Input size="xl" placeholder="xl" pr={theme.sizes['16']} />
        <InputRightElement w="min-content" h={theme.sizes['14']} mr={theme.sizes['2']}>
          <Button size="md">md</Button>
        </InputRightElement>
      </InputGroup>
    </Stack>
  );
};

export const WithValidation = () => {
  const [isPristine, setIsPristine] = useState(true);
  const [url, setURL] = useState<{
    value: string;
    validation: Validation;
  }>({
    value: '',
    validation: {
      isValid: false,
    },
  });

  const validate = useValidateURL();

  useEffect(() => {
    if (!isPristine) {
      return;
    }
    setIsPristine(!url.value);
  }, [url.value, isPristine]);

  const isInvalid = useMemo(() => {
    return !isPristine && !!url.validation && !url.validation.isValid;
  }, [isPristine, url.validation]);

  return (
    <FormControl isInvalid={isInvalid}>
      <FormLabel>Label</FormLabel>
      <InputGroup>
        <Input
          value={url.value}
          onChange={(evt) =>
            setURL({
              value: evt.target.value,
              validation: validate({ value: evt.target.value }),
            })
          }
          placeholder="Enter a URL"
        />
      </InputGroup>
      <FormHelperText>Helper text.</FormHelperText>
      <FormErrorMessage>{url.validation?.errors?.[0]}</FormErrorMessage>
    </FormControl>
  );
};
