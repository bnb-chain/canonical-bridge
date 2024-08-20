import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

import { colors } from '../foundations/colors';

const baseStyle = defineStyle((props) => {
  return {
    color: mode(colors.light.button.brand.default, colors.dark.button.brand.default)(props),
    textDecoration: 'underline',
    _hover: {
      color: mode(colors.light.button.brand.hover, colors.dark.button.brand.hover)(props),
    },
    _active: {
      color: mode(colors.light.button.brand.active, colors.dark.button.brand.active)(props),
    },
    _focusVisible: {
      boxShadow: 'none',
    },
  };
});

export const theme = defineStyleConfig({
  baseStyle,
});
