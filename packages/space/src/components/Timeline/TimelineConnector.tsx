import {
  ComponentWithAs,
  Flex,
  FlexProps,
  SystemProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

import { theme } from '../../modules/theme';

type Props = FlexProps & { size?: SystemProps['flexBasis'] };

export const TimelineConnector: ComponentWithAs<'div', Props> = forwardRef<Props, 'div'>(
  ({ size, ...props }, ref) => {
    const { colorMode } = useColorMode();

    return (
      <Flex
        ref={ref}
        flex={1}
        flexBasis={size}
        opacity={0.1}
        borderColor={theme.colors[colorMode].border[4]}
        borderStyle="solid"
        borderWidth={theme.sizes['0.5']}
        {...props}
      />
    );
  },
);
