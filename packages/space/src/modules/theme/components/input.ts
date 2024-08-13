import { inputAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

import { colors } from '../foundations/colors';
import { DEFAULT_PROPS, INPUT_STYLES } from '../internal/input';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  field: {
    width: '100%',
    minWidth: 0,
    outline: 0,
    position: 'relative',
    appearance: 'none',
    transitionProperty: 'common',
    transitionDuration: 'normal',
    _disabled: {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
  },
});

const variantOutline = definePartsStyle((props) => {
  const invalid = {
    borderColor: mode(colors.light.text.danger, colors.dark.text.danger)(props),
    boxShadow: 'none',
    _focus: {
      boxShadow: `0 0 0 1px ${mode(colors.light.text.danger, colors.dark.text.danger)(props)}`,
    },
  };

  const base = {
    bg: mode(colors.light.input[1], colors.dark.input[1])(props),
    border: '1px solid',
    borderColor: mode(colors.light.border[4], colors.dark.border[4])(props),
    boxShadow: 'none',
    color: mode(colors.light.text.primary, colors.dark.text.primary)(props),
    _invalid: {
      ...invalid,
    },
  };

  return {
    field: {
      ...base,
      _active: {
        ...base,
      },
      _hover: {
        ...base,
      },
      _readOnly: {
        ...base,
      },
      _disabled: {
        ...base,
        opacity: 0.5,
        cursor: 'not-allowed',
      },
      _invalid: {
        ...invalid,
      },
      _focus: {
        ...base,
        borderColor: mode(colors.light.border.brand, colors.dark.border.brand)(props),
        boxShadow: `0 0 0 1px ${mode(colors.light.border.brand, colors.dark.border.brand)(props)}`,
      },
      _focusVisible: {
        ...base,
        borderColor: mode(colors.light.border.brand, colors.dark.border.brand)(props),
        boxShadow: `0 0 0 1px ${mode(colors.light.border.brand, colors.dark.border.brand)(props)}`,
      },
      _placeholder: {
        color: mode(colors.light.text.placeholder, colors.dark.text.placeholder)(props),
        opacity: 1,
      },
    },
    addon: {},
  };
});

const variants = {
  outline: variantOutline,
};

export const theme = defineMultiStyleConfig({
  baseStyle,
  sizes: {
    '2xl': definePartsStyle({
      field: INPUT_STYLES['2xl'],
      addon: INPUT_STYLES['2xl'],
    }),
    xl: definePartsStyle({
      field: INPUT_STYLES.xl,
      addon: INPUT_STYLES.xl,
    }),
    lg: definePartsStyle({
      field: INPUT_STYLES.lg,
      addon: INPUT_STYLES.lg,
    }),
    md: definePartsStyle({
      field: INPUT_STYLES.md,
      addon: INPUT_STYLES.md,
    }),
    sm: definePartsStyle({
      field: INPUT_STYLES.sm,
      addon: INPUT_STYLES.sm,
    }),
  },
  variants,
  defaultProps: DEFAULT_PROPS,
});
