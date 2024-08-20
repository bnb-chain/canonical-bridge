import {
  ComponentWithAs,
  Flex,
  FlexProps,
  ResponsiveValue,
  forwardRef,
  useBreakpointValue,
  useColorMode,
} from '@chakra-ui/react';

import { theme } from '../../../modules/theme';

import { ColorScheme, DEFAULT_PROPS, Variant } from './types';

export { AccentCardContent } from './AccentCardContent';
export { AccentCardDescription } from './AccentCardDescription';
export { AccentCardFooter } from './AccentCardFooter';
export { AccentCardTitle } from './AccentCardTitle';

type Props = FlexProps & {
  colorScheme?: ResponsiveValue<ColorScheme>;
  variant?: ResponsiveValue<Variant>;
};

export const AccentCard: ComponentWithAs<'div', Props> = forwardRef<Props, 'div'>(
  (
    {
      colorScheme: responsiveColorScheme = DEFAULT_PROPS.colorScheme,
      variant: responsiveVariant = DEFAULT_PROPS.variant,
      ...props
    },
    ref,
  ) => {
    const { colorMode } = useColorMode();

    const colorScheme = (useBreakpointValue(responsiveColorScheme as any) ??
      responsiveColorScheme) as ColorScheme;
    const variant = useBreakpointValue(responsiveVariant as any) ?? (responsiveVariant as Variant);

    return (
      <Flex
        ref={ref}
        flexDirection={{ base: 'column', lg: 'row' }}
        alignItems={{ base: 'start', lg: 'center' }}
        justifyContent={{ base: 'center', lg: 'start' }}
        borderColor={theme.colors[colorMode].border[3]}
        borderStyle="solid"
        borderWidth={variant === 'outline' ? theme.sizes['0.5'] : 0}
        bg={theme.colors[colorMode].layer[2].default}
        borderRadius={theme.sizes['8']}
        boxShadow={`0px ${theme.sizes[1]} 0px 0px ${theme.colors[colorMode].support[colorScheme][3]}, ${theme.colors[colorMode].shadow[4]}`}
        transition="transform 0.4s ease-in-out"
        _hover={{
          transform: 'scale(0.95)',
        }}
        {...props}
      />
    );
  },
);
