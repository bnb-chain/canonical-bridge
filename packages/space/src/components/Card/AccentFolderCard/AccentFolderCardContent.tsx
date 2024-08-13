import { ComponentWithAs, Flex, FlexProps, forwardRef } from '@chakra-ui/react';

import { theme } from '../../../modules/theme';

export const AccentFolderCardContent: ComponentWithAs<'div', FlexProps> = forwardRef<
  FlexProps,
  'div'
>((props, ref) => {
  return (
    <Flex
      ref={ref}
      position="absolute"
      flexDirection="column"
      px={{ base: theme.sizes['5'], md: theme.sizes['10'], lg: theme.sizes['8'] }}
      pb={{ base: theme.sizes['8'], md: theme.sizes['12'], lg: theme.sizes['12'] }}
      w={{ base: '100%', lg: 'auto' }}
      {...props}
    />
  );
});
