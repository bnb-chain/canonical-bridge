import { defineCssVars, defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';

import { sizes } from '../foundations/sizes';
import { BADGE_STYLES, DEFAULT_PROPS } from '../internal/badge';
import { colors } from '../foundations/colors';

export const COLOR_SCHEMES = ['primary', 'brand', 'success', 'warning', 'danger'] as const;
export type ColorScheme = typeof COLOR_SCHEMES[number];

export const vars = defineCssVars('badge', ['bg', 'color', 'shadow']);

const getColorSchemeIndex = (colorScheme: ColorScheme) => {
  return colorScheme === 'primary' ? 1 : 2;
};

const baseStyle = defineStyle({
  textTransform: 'none',
  borderRadius: sizes['1'],
  bg: vars.bg.reference,
  color: vars.color.reference,
  boxShadow: vars.shadow.reference,
});

const variantSolid = defineStyle((props) => {
  const colorScheme = props.colorScheme as ColorScheme;

  return {
    [vars.bg.variable]: colors.light.support[colorScheme][getColorSchemeIndex(colorScheme)],
    [vars.color.variable]: colors.light.text.on.color.primary,
    _dark: {
      [vars.bg.variable]: colors.dark.support[colorScheme][getColorSchemeIndex(colorScheme)],
      [vars.color.variable]: colors.dark.text.on.color.primary,
    },
  };
});

const variantSubtle = defineStyle((props) => {
  const colorScheme = props.colorScheme as ColorScheme;

  return {
    [vars.bg.variable]: colors.light.support.primary[5],
    [vars.color.variable]: colors.light.support[colorScheme][getColorSchemeIndex(colorScheme)],
    _dark: {
      [vars.bg.variable]: colors.dark.support.primary[5],
      [vars.color.variable]: colors.dark.support[colorScheme][getColorSchemeIndex(colorScheme)],
    },
  };
});

const variantGrayscale = defineStyle((props) => {
  const colorScheme = props.colorScheme as ColorScheme;

  return {
    [vars.bg.variable]: colors.light.support.primary[5],
    [vars.color.variable]: colors.light.text.secondary,
    svg: {
      color: colors.light.support[colorScheme][getColorSchemeIndex(colorScheme)],
    },
    _dark: {
      [vars.bg.variable]: colors.dark.support.primary[5],
      [vars.color.variable]: colors.dark.text.secondary,
      svg: {
        color: colors.dark.support[colorScheme][getColorSchemeIndex(colorScheme)],
      },
    },
  };
});

const variantOutline = defineStyle((props) => {
  const colorScheme = props.colorScheme as ColorScheme;

  return {
    [vars.color.variable]: colors.light.support[colorScheme][getColorSchemeIndex(colorScheme)],
    _dark: {
      [vars.color.variable]: colors.dark.support[colorScheme][getColorSchemeIndex(colorScheme)],
    },
    [vars.shadow.variable]: `inset 0 0 0px 1px ${vars.color.reference}`,
  };
});

const variants = {
  solid: variantSolid,
  subtle: variantSubtle,
  outline: variantOutline,
  grayscale: variantGrayscale,
};

export const theme = defineStyleConfig({
  baseStyle,
  variants,
  sizes: BADGE_STYLES,
  defaultProps: DEFAULT_PROPS,
});
