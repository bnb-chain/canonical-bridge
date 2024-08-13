import { ComponentWithAs, Flex, FlexProps, forwardRef, theme } from '@chakra-ui/react';

export const ToastContent: ComponentWithAs<'div', FlexProps> = forwardRef<FlexProps, 'div'>(
  (props, ref) => {
    return (
      <Flex
        ref={ref}
        flex={1}
        flexDirection="column"
        p={theme.sizes['4']}
        ml={`-${theme.sizes['1']}`}
        pointerEvents="none"
        {...props}
      />
    );
  },
);
