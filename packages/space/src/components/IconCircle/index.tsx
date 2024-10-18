import {
  Center,
  CenterProps,
  ComponentWithAs,
  ResponsiveValue,
  forwardRef,
  useBreakpointValue,
  useColorMode,
} from '@chakra-ui/react';
import { useMemo } from 'react';

import { theme } from '../../modules/theme';

import { ColorScheme, DEFAULT_PROPS, Size, Variant } from './types';

type Props = CenterProps & {
  colorScheme?: ResponsiveValue<ColorScheme>;
  size?: ResponsiveValue<Size>;
  variant?: ResponsiveValue<Variant>;
};

export const IconCircle: ComponentWithAs<'div', Props> = forwardRef<Props, 'div'>(
  (
    {
      colorScheme: responsiveColorScheme = DEFAULT_PROPS.colorScheme,
      size: responsiveSize = DEFAULT_PROPS.size,
      // variant = DEFAULT_PROPS.variant,
      children,
      ...otherProps
    },
    ref,
  ) => {
    const { colorMode } = useColorMode();

    const size = useBreakpointValue(responsiveSize as any) ?? responsiveSize;
    const colorScheme = (useBreakpointValue(responsiveColorScheme as any) ??
      responsiveColorScheme) as ColorScheme;

    const sizes = useMemo((): {
      inner: CenterProps['w'];
      outer: CenterProps['w'];
      icon: CenterProps['fontSize'];
    } => {
      if (size === 'sm') {
        return {
          inner: theme.sizes['10'],
          outer: theme.sizes['16'],
          icon: theme.sizes['8'],
        };
      }

      if (size === 'md') {
        return {
          inner: theme.sizes['14'],
          outer: theme.sizes['20'],
          icon: theme.sizes['10'],
        };
      }

      if (size === 'lg') {
        return {
          inner: theme.sizes['18'],
          outer: theme.sizes['24'],
          icon: theme.sizes['12'],
        };
      }

      throw new Error(`Size "${size}" is not valid.`);
    }, [size]);

    return (
      <Center
        ref={ref}
        w={sizes.outer}
        h={sizes.outer}
        borderRadius="50%"
        bg={theme.colors[colorMode].support[colorScheme][5]}
        {...otherProps}
      >
        <Center
          w={sizes.inner}
          h={sizes.inner}
          borderRadius="50%"
          bg={theme.colors[colorMode].support[colorScheme][4]}
          sx={{
            svg: {
              color: theme.colors[colorMode].support[colorScheme][1],
              fontSize: sizes.icon,
            },
          }}
        >
          {children}
        </Center>
      </Center>
    );
  },
);
