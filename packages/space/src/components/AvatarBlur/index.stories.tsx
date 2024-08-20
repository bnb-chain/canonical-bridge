import { StackProps, VStack } from '@chakra-ui/react';
import { Meta } from '@storybook/react';

import { theme } from '../../modules/theme';

import { AvatarBlur } from '.';

export default {
  title: 'Components/Atoms/AvatarBlur',
} as Meta;

const Stack = (props: StackProps) => {
  return <VStack alignItems="start" w="min-content" spacing={theme.sizes['8']} {...props} />;
};

export const Default = () => {
  return (
    <Stack>
      <AvatarBlur value="0x0" size={theme.sizes['20']} />
      <AvatarBlur value="0x1" size={theme.sizes['20']} />
      <AvatarBlur value="0x2" size={theme.sizes['20']} />
      <AvatarBlur value="0x3" size={theme.sizes['20']} />
      <AvatarBlur value="0x4" size={theme.sizes['20']} />
    </Stack>
  );
};

export const Sizes = () => {
  return (
    <Stack>
      {[
        theme.sizes['5'],
        theme.sizes['8'],
        theme.sizes['12'],
        theme.sizes['16'],
        theme.sizes['20'],
      ].map((it) => {
        return <AvatarBlur key={it} value="0x0" size={it} />;
      })}
    </Stack>
  );
};
