import { StackProps, VStack } from '@chakra-ui/react';
import { Meta } from '@storybook/react';

import { theme } from '../../modules/theme';
import { STATUSES } from '../internal/Status';

import { IconStatus } from '.';

export default {
  title: 'Components/Atoms/IconStatus',
} as Meta;

const Stack = (props: StackProps) => {
  return <VStack alignItems="start" w="min-content" spacing={theme.sizes['8']} {...props} />;
};

export const Default = () => {
  return (
    <Stack>
      {STATUSES.map((it) => {
        return <IconStatus key={it} status={it} />;
      })}
    </Stack>
  );
};

export const Sizes = () => {
  return (
    <Stack>
      {[
        theme.sizes['4'],
        theme.sizes['6'],
        theme.sizes['8'],
        theme.sizes['12'],
        theme.sizes['16'],
      ].map((it) => {
        return (
          <IconStatus key={it} status="info" size={it}>
            {it}
          </IconStatus>
        );
      })}
    </Stack>
  );
};
