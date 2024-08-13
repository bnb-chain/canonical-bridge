import { ComponentWithAs, forwardRef, useColorMode } from '@chakra-ui/react';

import { theme } from '../../../modules/theme';
import { PartialTypographyProps, Typography } from '../../Typography';

export const AccentCardTitle: ComponentWithAs<'p', PartialTypographyProps> = forwardRef<
  PartialTypographyProps,
  'p'
>(({ variant, size, ...otherProps }, ref) => {
  const { colorMode } = useColorMode();

  return (
    <Typography
      ref={ref}
      variant="display"
      size={{ base: '2xs', md: 'xs' }}
      color={theme.colors[colorMode].text.primary}
      mb={{ base: theme.sizes['4'], md: theme.sizes['6'] }}
      {...otherProps}
    />
  );
});
