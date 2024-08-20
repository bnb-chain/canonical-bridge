import { cssVar, defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { darken, lighten } from 'polished';

import { colors } from '../foundations/colors';
import { sizes } from '../foundations/sizes';

const $startColor = cssVar('skeleton-start-color');
const $endColor = cssVar('skeleton-end-color');

const baseStyle = defineStyle(() => ({
  [$startColor.variable]: colors.light.layer.disabled,
  [$endColor.variable]: lighten(0.6, colors.light.layer.disabled),
  _dark: {
    [$startColor.variable]: colors.dark.layer.disabled,
    [$endColor.variable]: darken(0.4, colors.dark.layer.disabled),
  },
  background: $startColor.reference,
  borderColor: $endColor.reference,
  borderRadius: sizes['2'],
  opacity: 1,
}));

export const theme = defineStyleConfig({
  baseStyle,
});
