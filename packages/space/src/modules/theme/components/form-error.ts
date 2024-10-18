import { formErrorAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

import { colors } from '../foundations/colors';
import { sizes } from '../foundations/sizes';
import { typography } from '../foundations/typography';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyleText = defineStyle((props) => {
  return {
    color: mode(colors.light.text.danger, colors.dark.text.danger)(props),
    mt: sizes['2'],
    fontSize: typography.fontSizes['3.5'],
  };
});

const baseStyleIcon = defineStyle({});

const baseStyle = definePartsStyle((props) => ({
  text: baseStyleText(props),
  icon: baseStyleIcon,
}));

export const theme = defineMultiStyleConfig({
  baseStyle,
});
