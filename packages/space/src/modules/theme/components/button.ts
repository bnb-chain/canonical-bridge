import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

import { colors } from '../foundations/colors';
import { sizes } from '../foundations/sizes';
import { BUTTON_STYLES, DEFAULT_PROPS } from '../internal/button';

export const COLOR_SCHEMES = [
  'primary',
  'brand',
  'success',
  'warning',
  'danger',
  'greenfield',
] as const;
export type ColorScheme = typeof COLOR_SCHEMES[number];

const focus = defineStyle((_) => {
  return {
    // boxShadow: `0 0 0 1px ${mode(
    //   colors.light.border.secondary[10],
    //   colors.dark.border.secondary[10],
    // )(props)}, 0 0 0 3px ${mode(
    //   colors.light.border.brand[10],
    //   colors.dark.border.brand[10],
    // )(props)}`,
  };
});

const variantSubtle = defineStyle((props) => {
  const colorScheme = props.colorScheme as ColorScheme;

  const base = {
    _disabled: {
      bg: mode(colors.light.button.disabled, colors.dark.button.disabled)(props),
      color: mode(colors.light.text.on.color.disabled, colors.dark.text.on.color.disabled)(props),
      opacity: 1,
      cursor: 'not-allowed',
    },
  };

  return {
    ...base,
    color: mode(
      colors.light.button[colorScheme].default,
      colors.dark.button[colorScheme].default,
    )(props),
    bg: mode(
      colors.light.button[colorScheme].subtle,
      colors.dark.button[colorScheme].subtle,
    )(props),
    _hover: {
      ...base,
      color: mode(colors.light.text.on.color.primary, colors.dark.text.on.color.primary)(props),
      bg: mode(
        colors.light.button[colorScheme].hover,
        colors.dark.button[colorScheme].hover,
      )(props),
    },
    _active: {
      ...base,
      color: mode(colors.light.text.on.color.primary, colors.dark.text.on.color.primary)(props),
      bg: mode(
        colors.light.button[colorScheme].active,
        colors.dark.button[colorScheme].active,
      )(props),
    },
    _focus: {
      ...base,
      ...focus(props),
    },
  };
});

const variantGhost = defineStyle((props) => {
  const colorScheme = props.colorScheme as ColorScheme;

  const base = {
    _disabled: {
      bg: mode(colors.light.button.disabled, colors.dark.button.disabled)(props),
      color: mode(colors.light.text.on.color.disabled, colors.dark.text.on.color.disabled)(props),
      opacity: 1,
      cursor: 'not-allowed',
    },
  };

  return {
    ...base,
    color: mode(
      colors.light.button[colorScheme].default,
      colors.dark.button[colorScheme].default,
    )(props),
    bg: 'transparent',
    _hover: {
      ...base,
      color: mode(colors.light.text.on.color.primary, colors.dark.text.on.color.primary)(props),
      bg: mode(
        colors.light.button[colorScheme].hover,
        colors.dark.button[colorScheme].hover,
      )(props),
    },
    _active: {
      ...base,
      color: mode(colors.light.text.on.color.primary, colors.dark.text.on.color.primary)(props),
      bg: mode(
        colors.light.button[colorScheme].active,
        colors.dark.button[colorScheme].active,
      )(props),
    },
    _focus: {
      ...base,
      ...focus(props),
    },
  };
});

const variantOutline = defineStyle((props) => {
  const colorScheme = props.colorScheme as ColorScheme;

  const base = {
    borderWidth: '1px',
    _disabled: {
      borderColor: mode(colors.light.button.disabled, colors.dark.button.disabled)(props),
      color: mode(colors.light.text.disabled, colors.dark.text.disabled)(props),
      opacity: 1,
      cursor: 'not-allowed',
    },
  };

  return {
    ...base,
    bg: 'transparent',
    borderColor: mode(
      colors.light.button[colorScheme].default,
      colors.dark.button[colorScheme].default,
    )(props),
    color: mode(
      colors.light.button[colorScheme].default,
      colors.dark.button[colorScheme].default,
    )(props),
    _hover: {
      ...base,
      bg: mode(
        colors.light.button[colorScheme].hover,
        colors.dark.button[colorScheme].hover,
      )(props),
      borderColor: 'transparent',
      color: mode(colors.light.text.on.color.primary, colors.dark.text.on.color.primary)(props),
    },
    _active: {
      ...base,
      bg: mode(
        colors.light.button[colorScheme].active,
        colors.dark.button[colorScheme].active,
      )(props),
      borderColor: 'transparent',
      color: mode(colors.light.text.on.color.primary, colors.dark.text.on.color.primary)(props),
    },
    _focus: {
      ...base,
      ...focus(props),
    },
  };
});

const variantSolid = defineStyle((props) => {
  const colorScheme = props.colorScheme as ColorScheme;

  const base = {
    _disabled: {
      bg: mode(colors.light.button.disabled, colors.dark.button.disabled)(props),
      color: mode(colors.light.text.on.color.disabled, colors.dark.text.on.color.disabled)(props),
      opacity: 1,
      cursor: 'not-allowed',
    },
  };

  return {
    ...base,
    bg: mode(
      colors.light.button[colorScheme].default,
      colors.dark.button[colorScheme].default,
    )(props),
    color: mode(colors.light.text.on.color.primary, colors.dark.text.on.color.primary)(props),
    _hover: {
      ...base,
      bg: mode(
        colors.light.button[colorScheme].hover,
        colors.dark.button[colorScheme].hover,
      )(props),
    },
    _active: {
      ...base,
      bg: mode(
        colors.light.button[colorScheme].active,
        colors.dark.button[colorScheme].active,
      )(props),
    },
    _focus: {
      ...base,
      ...focus(props),
    },
  };
});

const variantText = defineStyle((props) => {
  const colorScheme = props.colorScheme as ColorScheme;

  const base = {
    minW: 'min-content',
    height: 'min-content',
    padding: 0,
    _disabled: {
      color: mode(colors.light.text.disabled, colors.dark.text.disabled)(props),
      opacity: 1,
      cursor: 'not-allowed',
    },
  };

  // Copied from `subtle` variant.

  return {
    ...base,
    color: mode(
      colors.light.button[colorScheme].default,
      colors.dark.button[colorScheme].default,
    )(props),
    _hover: {
      ...base,
      color: mode(
        colors.light.button[colorScheme].hover,
        colors.dark.button[colorScheme].hover,
      )(props),
    },
    _active: {
      ...base,
      color: mode(
        colors.light.button[colorScheme].active,
        colors.dark.button[colorScheme].active,
      )(props),
    },
    _focus: {
      ...base,
      ...focus(props),
    },
  };
});

const variants = {
  solid: variantSolid,
  subtle: variantSubtle,
  ghost: variantGhost,
  outline: variantOutline,
  text: variantText,
  // unstyled: variantUnstyled,
};

export const theme = defineStyleConfig({
  baseStyle: {
    fontWeight: '500',
    _hover: {
      _disabled: {
        bg: 'initial',
      },
    },
  },
  variants,
  sizes: {
    '2xl': defineStyle({
      ...BUTTON_STYLES['2xl'],
      minW: sizes['30'],
      px: sizes['8'],
      borderRadius: sizes['2'],
    }),
    xl: defineStyle({
      ...BUTTON_STYLES['xl'],
      minW: sizes['30'],
      px: sizes['6'],
      borderRadius: sizes['2'],
    }),
    lg: defineStyle({
      ...BUTTON_STYLES['lg'],
      minW: sizes['24'],
      px: sizes['6'],
      borderRadius: sizes['2'],
    }),
    md: defineStyle({
      ...BUTTON_STYLES['md'],
      minW: sizes['18'],
      px: sizes['4'],
      borderRadius: sizes['2'],
    }),
    sm: defineStyle({
      ...BUTTON_STYLES['sm'],
      minW: sizes['16'],
      px: sizes['4'],
      borderRadius: sizes['2'],
    }),
    xs: defineStyle({
      ...BUTTON_STYLES['xs'],
      minW: sizes['14'],
      px: sizes['2'],
      borderRadius: sizes['2'],
    }),
  },
  defaultProps: DEFAULT_PROPS,
});
