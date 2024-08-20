import { ComponentWithAs, Flex, FlexProps, forwardRef, theme } from '@chakra-ui/react';

export const ToastLeftContent: ComponentWithAs<'div', FlexProps> = forwardRef<FlexProps, 'div'>(
  (props, ref) => {
    return <Flex ref={ref} p={theme.sizes['4']} mr={`-${theme.sizes['4']}`} {...props} />;
  },
);
