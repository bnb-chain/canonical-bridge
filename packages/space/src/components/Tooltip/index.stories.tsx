import { StackProps, Tooltip, VStack } from '@chakra-ui/react';
import { Meta } from '@storybook/react';

import { theme } from '../../modules/theme';
import { Button } from '../Button';

const TOOLTIP_SIZES = ['sm', 'md', 'lg'] as const;

export default {
  title: 'Components/Atoms/Tooltip',
} as Meta;

const Stack = (props: StackProps) => {
  return (
    <VStack
      alignItems="start"
      w="min-content"
      spacing={theme.sizes['8']}
      sx={{
        span: {
          w: 'min-content',
        },
      }}
      {...props}
    />
  );
};

export const Default = () => {
  return (
    <Tooltip label="Tooltip" aria-label="Tooltip" hasArrow>
      <Button w="min-content">Button</Button>
    </Tooltip>
  );
};

export const Sizes = () => {
  return (
    <Stack>
      {TOOLTIP_SIZES.map((it) => {
        return (
          <Tooltip key={it} label={it} size={it} hasArrow>
            <Button w="min-content">Button</Button>
          </Tooltip>
        );
      })}
    </Stack>
  );
};
