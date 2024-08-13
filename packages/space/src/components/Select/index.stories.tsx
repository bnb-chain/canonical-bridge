import { StackProps, VStack } from '@chakra-ui/react';
import { Meta } from '@storybook/react';
import { useState } from 'react';

import { theme } from '../../modules/theme';

import { Select } from '.';

const SELECT_SIZES = ['sm', 'md', 'lg', 'xl'] as const;

const OPTIONS = [
  { value: 1, label: 'One' },
  { value: 2, label: 'Two' },
  { value: 3, label: 'Three' },
];

interface Option {
  value: number;
  label: string;
}

export default {
  title: 'Components/Atoms/Select',
} as Meta;

const Stack = (props: StackProps) => {
  return (
    <VStack
      alignItems="start"
      w="100%"
      spacing={theme.sizes['8']}
      sx={{
        '> *': {
          w: '100%',
        },
      }}
      {...props}
    />
  );
};

export const Default = () => {
  const [selectedOption, setSelectedOpen] = useState<Option | null>(null);

  return (
    <Select<Option>
      defaultValue={selectedOption}
      value={selectedOption}
      onChange={(value) => setSelectedOpen(value)}
      options={OPTIONS}
    />
  );
};

export const Sizes = () => {
  const [selectedOption, setSelectedOpen] = useState<Option | null>(null);

  return (
    <Stack>
      {SELECT_SIZES.map((it) => {
        return (
          <Select<Option>
            key={it}
            size={it}
            placeholder={it}
            defaultValue={selectedOption}
            value={selectedOption}
            onChange={(value) => setSelectedOpen(value)}
            options={OPTIONS}
          />
        );
      })}
    </Stack>
  );
};
