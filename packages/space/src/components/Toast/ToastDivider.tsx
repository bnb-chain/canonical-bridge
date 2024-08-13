import { ComponentWithAs, Flex, FlexProps, forwardRef, useColorMode } from '@chakra-ui/react';

import { theme } from '../../modules/theme';

export const ToastDivider: ComponentWithAs<'div', FlexProps> = forwardRef<FlexProps, 'div'>(
  (props, ref) => {
    const { colorMode } = useColorMode();

    return (
      <Flex
        ref={ref}
        borderColor={theme.colors[colorMode].border[3]}
        borderStyle="solid"
        borderWidth="1px"
        mx={theme.sizes['3']}
        my={`-${theme.sizes['4']}`}
        {...props}
      />
    );
  },
);
