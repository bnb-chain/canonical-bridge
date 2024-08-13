import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';

import { colors } from '../foundations/colors';

const baseStyle = defineStyle({
  borderColor: colors.light.border[3],
  _dark: {
    borderColor: colors.dark.border[3],
  },
});

const variantSolid = defineStyle({
  borderStyle: 'solid',
});

const variantDashed = defineStyle({
  borderStyle: 'dashed',
});

const variants = {
  solid: variantSolid,
  dashed: variantDashed,
};

export const theme = defineStyleConfig({
  baseStyle,
  variants,
  defaultProps: {
    variant: 'solid',
  },
});
