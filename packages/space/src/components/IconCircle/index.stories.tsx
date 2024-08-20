import { BNBChainIcon } from '@bnb-chain/icons';
import { StackProps, VStack } from '@chakra-ui/react';
import { Meta } from '@storybook/react';

import { theme } from '../../modules/theme';

import { COLOR_SCHEMES, SIZES } from './types';

import { IconCircle } from '.';

export default {
  title: 'Components/Atoms/IconCircle',
} as Meta;

const Stack = (props: StackProps) => {
  return <VStack alignItems="start" w="min-content" spacing={theme.sizes['8']} {...props} />;
};

export const Default = () => {
  return (
    <Stack>
      {COLOR_SCHEMES.map((it) => {
        return (
          <IconCircle key={it} colorScheme={it}>
            <BNBChainIcon />
          </IconCircle>
        );
      })}
    </Stack>
  );
};

export const Sizes = () => {
  return (
    <Stack>
      {SIZES.map((it) => {
        return (
          <IconCircle key={it} size={it}>
            {it}
          </IconCircle>
        );
      })}
    </Stack>
  );
};
