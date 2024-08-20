import { ComponentWithAs, Flex, FlexProps, forwardRef } from '@chakra-ui/react';

import { theme } from '../../../modules/theme';

export const AccentCardContent: ComponentWithAs<'div', FlexProps> = forwardRef<FlexProps, 'div'>(
  (props, ref) => {
    return (
      <Flex
        ref={ref}
        flexDirection="column"
        px={{ base: theme.sizes['5'], md: theme.sizes['14'] }}
        py={{ base: theme.sizes['8'], md: theme.sizes['14'] }}
        w={{ base: '100%', lg: 'auto' }}
        {...props}
      />
    );
  },
);
