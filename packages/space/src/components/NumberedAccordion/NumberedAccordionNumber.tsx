import { ComponentWithAs, forwardRef, useColorMode } from '@chakra-ui/react';

import { theme } from '../../modules/theme';
import { PartialTypographyProps, Typography } from '../Typography';

export const NumberedAccordionNumber: ComponentWithAs<'p', PartialTypographyProps> = forwardRef<
  PartialTypographyProps,
  'p'
>(({ variant, size, children, ...otherProps }, ref) => {
  const { colorMode } = useColorMode();

  return (
    <Typography
      ref={ref}
      as="div"
      variant="heading"
      size={{ base: 'md', md: 'lg' }}
      fontWeight="500"
      color={theme.colors[colorMode].text.tertiary}
      textAlign="left"
      w={{ base: theme.sizes['16'], md: theme.sizes['24'] }}
      flexShrink={0}
      {...otherProps}
    >
      {typeof children === 'number' ? `${children}`.padStart(2, '0') : children}
    </Typography>
  );
});
