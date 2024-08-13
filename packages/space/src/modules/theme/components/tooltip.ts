import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { cssVar } from '@chakra-ui/theme-tools';

import { colors } from '../foundations/colors';
import { sizes } from '../foundations/sizes';
import { typography } from '../foundations/typography';

const $bg = cssVar('tooltip-bg');
const $fg = cssVar('tooltip-fg');
const $arrowBg = cssVar('popper-arrow-bg');

const baseStyle = defineStyle({
  bg: $bg.reference,
  color: $fg.reference,
  [$bg.variable]: colors.light.layer.inverse,
  [$fg.variable]: colors.light.text.inverse,
  boxShadow: colors.light.shadow[4],
  _dark: {
    [$bg.variable]: colors.dark.layer.inverse,
    [$fg.variable]: colors.dark.text.inverse,
    boxShadow: colors.dark.shadow[4],
  },
  [$arrowBg.variable]: $bg.reference,
  px: sizes['2'],
  py: sizes['0.5'],
  borderRadius: sizes['1'],
  zIndex: 'tooltip',
});

export const theme = defineStyleConfig({
  baseStyle,
  sizes: {
    sm: defineStyle({
      fontSize: typography.fontSizes['3'],
      lineHeight: sizes['4'],
      px: sizes['2'],
      py: sizes['1'],
    }),
    md: defineStyle({
      fontSize: typography.fontSizes['3'],
      lineHeight: sizes['4'],
      px: sizes['2'],
      py: sizes['1'],
    }),
    lg: defineStyle({
      fontSize: typography.fontSizes['4'],
      lineHeight: sizes['6'],
      px: sizes['4'],
      py: sizes['2'],
    }),
  },
  defaultProps: {
    size: 'md',
  },
});
