import { ComponentWithAs, forwardRef, HStack, StackProps } from '@chakra-ui/react';

import { theme } from '../../../modules/theme';

export const AccentCardFooter: ComponentWithAs<'div', StackProps> = forwardRef<StackProps, 'div'>(
  (props, ref) => {
    return (
      <HStack
        ref={ref}
        mt={{ base: theme.sizes['8'], md: theme.sizes['10'] }}
        spacing={{ base: theme.sizes['4'] }}
        {...props}
      />
    );
  },
);
