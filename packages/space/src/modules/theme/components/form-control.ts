import { formAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, cssVar, defineStyle } from '@chakra-ui/styled-system';

import { colors } from '../foundations/colors';
import { sizes } from '../foundations/sizes';
import { typography } from '../foundations/typography';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const $fg = cssVar('form-control-color');

const baseStyleHelperText = defineStyle(() => ({
  mt: sizes['2'],
  [$fg.variable]: colors.light.text.tertiary,
  _dark: {
    [$fg.variable]: colors.dark.text.tertiary,
  },
  color: $fg.reference,
  fontSize: typography.fontSizes['3.5'],
  lineHeight: typography.fontSizes['4'],
}));

const baseStyle = definePartsStyle(() => ({
  container: {
    width: '100%',
    position: 'relative',
  },
  helperText: baseStyleHelperText(),
}));

export const theme = defineMultiStyleConfig({
  baseStyle,
});
