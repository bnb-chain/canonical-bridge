import {
  Box,
  ComponentWithAs,
  Flex,
  FlexProps,
  ResponsiveValue,
  forwardRef,
  useBreakpointValue,
  useColorMode,
} from '@chakra-ui/react';
import { useMemo } from 'react';

import { theme } from '../../../modules/theme';

import { ColorScheme, DEFAULT_PROPS, Size, Variant } from './types';

export { AccentFolderCardContent } from './AccentFolderCardContent';
export { AccentFolderCardDescription } from './AccentFolderCardDescription';
export { AccentFolderCardFooter } from './AccentFolderCardFooter';
export { AccentFolderCardTitle } from './AccentFolderCardTitle';

type Props = FlexProps & {
  colorScheme?: ResponsiveValue<ColorScheme>;
  size: ResponsiveValue<Size>;
  variant?: ResponsiveValue<Variant>;
};

export const AccentFolderCard: ComponentWithAs<'div', Props> = forwardRef<Props, 'div'>(
  (
    {
      children,
      colorScheme: responsiveColorScheme = DEFAULT_PROPS.colorScheme,
      size: responsiveSize,
      variant: responsiveVariant = DEFAULT_PROPS.variant,
      ...props
    },
    ref,
  ) => {
    const { colorMode } = useColorMode();

    const colorScheme = (useBreakpointValue(responsiveColorScheme as any) ??
      responsiveColorScheme) as ColorScheme;
    const size = (useBreakpointValue(responsiveSize as any) ?? responsiveSize) as Size;
    const variant = useBreakpointValue(responsiveVariant as any) ?? (responsiveVariant as Variant);

    const { d, width, height } = useMemo(() => {
      const sizes = {
        sm: {
          d: 'M1 26.0923C1 19.0775 3.08741 12.7668 6.41309 8.23379C9.7392 3.70021 14.2516 1 19.1429 1H109.827C114.214 1 118.521 3.21802 121.887 7.3653L150.554 42.6818C154.225 47.2045 159.067 49.7866 164.166 49.7866H315.857C320.748 49.7866 325.261 52.4868 328.587 57.0204C331.913 61.5534 334 67.8641 334 74.8789V397.908C334 404.922 331.913 411.233 328.587 415.766C325.261 420.3 320.748 423 315.857 423H19.1429C14.2516 423 9.7392 420.3 6.41309 415.766C3.08741 411.233 1 404.923 1 397.908V26.0923Z',
          width: 335,
          height: 424,
        },
        md: {
          d: 'M1 32C1 15.0581 17.8793 1 39.1429 1H224.572C234.076 1 243.217 3.88575 250.225 9.06426L308.842 52.3769C316.224 57.8314 325.79 60.8326 335.683 60.8326H645.857C667.121 60.8326 684 74.8907 684 91.8326V488C684 504.942 667.121 519 645.857 519H39.1429C17.8793 519 1 504.942 1 488V32Z',
          width: 685,
          height: 520,
        },
        lg: {
          d: 'M1 32C1 14.8792 14.8792 1 32 1H183.592C191.273 1 198.68 3.85151 204.379 9.00187L252.299 52.3145C258.365 57.7972 266.251 60.8326 274.427 60.8326H528C545.121 60.8326 559 74.7118 559 91.8326V488C559 505.121 545.121 519 528 519H32C14.8792 519 1 505.121 1 488V32Z',
          width: 560,
          height: 520,
        },
      } as const;

      return sizes[size];
    }, [size]);

    return (
      <Flex
        ref={ref}
        position="relative"
        filter={`drop-shadow(${theme.colors[colorMode].shadow[4]})`}
        transition="transform 0.4s ease-in-out"
        _hover={{
          transform: 'scale(0.95)',
        }}
        {...props}
      >
        <Box
          as="svg"
          viewBox={`0 0 ${width} ${height}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          position="absolute"
          w={props.w || props.width}
          h={props.h || props.height}
          preserveAspectRatio="none"
          stroke={theme.colors[colorMode].border[3]}
          strokeWidth={variant === 'outline' ? theme.sizes['0.5'] : 0}
          filter={`drop-shadow(${theme.sizes['0']} ${theme.sizes['1']} ${theme.sizes['0']} ${theme.colors[colorMode].support[colorScheme][3]});`}
        >
          <path d={d} fill={theme.colors[colorMode].layer[2].default} />
        </Box>
        {children}
      </Flex>
    );
  },
);
