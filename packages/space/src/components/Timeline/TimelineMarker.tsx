import { ComponentWithAs, Flex, FlexProps, forwardRef, useColorMode } from '@chakra-ui/react';

import { theme } from '../../modules/theme';

export const TimelineMarker: ComponentWithAs<'div', FlexProps> = forwardRef<FlexProps, 'div'>(
  (props, ref) => {
    const { colorMode } = useColorMode();

    return (
      <Flex
        ref={ref}
        w={theme.sizes['4']}
        h={theme.sizes['4']}
        borderColor={theme.colors[colorMode].border[4]}
        borderStyle="solid"
        borderWidth={theme.sizes['1']}
        borderRadius="50%"
        {...props}
      />
    );
  },
);
