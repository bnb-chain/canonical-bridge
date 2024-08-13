import {
  Center,
  CenterProps,
  ComponentWithAs,
  forwardRef,
  useBreakpointValue,
  useColorMode,
} from '@chakra-ui/react';

import { theme } from '../../modules/theme';
import { STATUSES_TO_COLOR_SCHEME, STATUSES_TO_ICON, Status } from '../internal/Status';

type Props = CenterProps & {
  size?: CenterProps['w'];
  status: Status;
};

export const IconStatus: ComponentWithAs<'div', Props> = forwardRef<Props, 'div'>(
  ({ size: responsiveSize = theme.sizes['4'], status, ...props }, ref) => {
    const { colorMode } = useColorMode();

    const size = useBreakpointValue(responsiveSize as any) ?? responsiveSize;

    return (
      <Center
        ref={ref}
        background={
          theme.colors[colorMode].support[
            STATUSES_TO_COLOR_SCHEME[status as keyof typeof STATUSES_TO_COLOR_SCHEME]
          ][4]
        }
        color={
          theme.colors[colorMode].support[
            STATUSES_TO_COLOR_SCHEME[status as keyof typeof STATUSES_TO_COLOR_SCHEME]
          ][1]
        }
        borderRadius="50%"
        w={size}
        h={size}
        sx={{
          svg: {
            fontSize: `calc(${size} * 0.7)`,
          },
        }}
        flexShrink={0}
        {...props}
      >
        {STATUSES_TO_ICON[status as keyof typeof STATUSES_TO_ICON]}
      </Center>
    );
  },
);
