import { ComponentWithAs, forwardRef, useColorMode } from '@chakra-ui/react';

import { theme } from '../../modules/theme';
import { PartialTypographyProps, Typography } from '../Typography';

export const NumberedAccordionTitle: ComponentWithAs<'p', PartialTypographyProps> = forwardRef<
  PartialTypographyProps,
  'p'
>(({ variant, size, ...otherProps }, ref) => {
  const { colorMode } = useColorMode();

  return (
    <Typography
      ref={ref}
      as="div"
      variant="heading"
      size={{ base: 'xs', md: 'md' }}
      fontWeight="500"
      color={theme.colors[colorMode].text.primary}
      textAlign="left"
      wordBreak="break-word"
      flex={1}
      {...otherProps}
    />
  );
});
