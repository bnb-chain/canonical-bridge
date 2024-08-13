import { ComponentWithAs, Flex, FlexProps, forwardRef } from '@chakra-ui/react';

export const TimelineContent: ComponentWithAs<'div', FlexProps> = forwardRef<FlexProps, 'div'>(
  (props, ref) => {
    return <Flex ref={ref} flex={1} {...props} />;
  },
);
