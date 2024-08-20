import { ComponentWithAs, forwardRef, useColorMode } from '@chakra-ui/react';

import { theme } from '../../modules/theme';
import { PartialTypographyProps, Typography } from '../Typography';

export const ToastTitle: ComponentWithAs<'p', PartialTypographyProps> = forwardRef<
  PartialTypographyProps,
  'p'
>(({ variant, size, ...otherProps }, ref) => {
  const { colorMode } = useColorMode();

  return (
    <Typography
      ref={ref}
      variant="body"
      size={{ base: 'md' }}
      fontWeight="700"
      color={theme.colors[colorMode].text.primary}
      mb={{ base: theme.sizes['1'] }}
      {...otherProps}
    />
  );
});
