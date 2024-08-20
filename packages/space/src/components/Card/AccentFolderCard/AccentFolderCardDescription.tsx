import { ComponentWithAs, forwardRef, useColorMode } from '@chakra-ui/react';

import { theme } from '../../../modules/theme';
import { PartialTypographyProps, Typography } from '../../Typography';

export const AccentFolderCardDescription: ComponentWithAs<'p', PartialTypographyProps> = forwardRef<
  PartialTypographyProps,
  'p'
>(({ variant, size, ...otherProps }, ref) => {
  const { colorMode } = useColorMode();

  return (
    <Typography
      ref={ref}
      variant="body"
      size={{ base: 'md', md: 'lg' }}
      color={theme.colors[colorMode].text.secondary}
      {...otherProps}
    />
  );
});
