import { ComponentWithAs, forwardRef, HStack, StackProps } from '@chakra-ui/react';

import { theme } from '../../../modules/theme';

export const AccentFolderCardFooter: ComponentWithAs<'div', StackProps> = forwardRef<
  StackProps,
  'div'
>((props, ref) => {
  return (
    <HStack
      ref={ref}
      mt={{ base: theme.sizes['6'], md: theme.sizes['10'], lg: theme.sizes['8'] }}
      spacing={{ base: theme.sizes['4'] }}
      {...props}
    />
  );
});
