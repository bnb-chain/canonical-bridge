import { ComponentWithAs, forwardRef, useColorMode } from '@chakra-ui/react';

import { theme } from '../../../modules/theme';
import { PartialTypographyProps, Typography } from '../../Typography';

export const CommunityCardTitle: ComponentWithAs<'p', PartialTypographyProps> = forwardRef<
  PartialTypographyProps,
  'p'
>(({ variant, size, ...otherProps }, ref) => {
  const { colorMode } = useColorMode();

  return (
    <Typography
      ref={ref}
      variant="body"
      size={{ base: 'md', md: 'md' }}
      fontWeight="500"
      color={theme.colors[colorMode].text.primary}
      textAlign={{ base: 'center', md: 'center' }}
      {...otherProps}
    />
  );
});
