import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

import { colors } from '../foundations/colors';
import { sizes } from '../foundations/sizes';
import { typography } from '../foundations/typography';

const baseStyle = defineStyle((props) => ({
  fontSize: typography.fontSizes['3.5'],
  fontWeight: '400',
  lineHeight: typography.fontSizes['4'],
  color: mode(colors.light.text.tertiary, colors.dark.text.tertiary)(props),
  mb: sizes['3'],
  opacity: 1,
  _disabled: {
    color: mode(colors.light.text.disabled, colors.dark.text.disabled)(props),
    opacity: 1,
  },
}));

export const theme = defineStyleConfig({
  baseStyle,
});
