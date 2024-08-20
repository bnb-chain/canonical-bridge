import { ComponentWithAs, Flex, FlexProps, forwardRef, theme } from '@chakra-ui/react';

export const ToastRightContent: ComponentWithAs<'div', FlexProps> = forwardRef<FlexProps, 'div'>(
  (props, ref) => {
    return <Flex ref={ref} p={theme.sizes['4']} {...props} />;
  },
);
