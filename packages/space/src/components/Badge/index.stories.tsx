import { Badge, HStack, StackProps, VStack } from '@chakra-ui/react';
import { Meta } from '@storybook/react';

import { theme } from '../../modules/theme';
import { COLOR_SCHEMES } from '../../modules/theme/components/badge';

const BADGE_VARIANTS = ['solid', 'outline', 'subtle', 'grayscale'] as const;
const BADGE_SIZES = ['sm', 'md', 'lg'] as const;
const BADGE_COLOR_SCHEMES = COLOR_SCHEMES;

export default {
  title: 'Components/Atoms/Badge',
} as Meta;

const Stack = (props: StackProps) => {
  return <VStack alignItems="start" w="min-content" spacing={theme.sizes['8']} {...props} />;
};

export const Default = () => {
  return (
    <Stack>
      {BADGE_COLOR_SCHEMES.map((colorScheme) => {
        return (
          <HStack key={colorScheme}>
            {BADGE_VARIANTS.map((it) => {
              return (
                <Badge key={it} colorScheme={colorScheme} variant={it}>
                  {it}
                </Badge>
              );
            })}
          </HStack>
        );
      })}
    </Stack>
  );
};

export const Sizes = () => {
  return (
    <Stack>
      {BADGE_SIZES.map((it) => {
        return (
          <Badge key={it} size={it}>
            {it}
          </Badge>
        );
      })}
    </Stack>
  );
};
