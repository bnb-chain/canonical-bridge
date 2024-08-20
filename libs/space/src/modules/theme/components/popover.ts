import { popoverAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/styled-system';
import { cssVar } from '@chakra-ui/theme-tools';

import { colors } from '../foundations/colors';
import { sizes } from '../foundations/sizes';
import { typography } from '../foundations/typography';

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(parts.keys);

const $popperBg = cssVar('popper-bg');
const $arrowBg = cssVar('popper-arrow-bg');
const $color = cssVar('popper-color');

const baseStyleContent = defineStyle({
  [$popperBg.variable]: colors.light.background[1],
  [$arrowBg.variable]: $popperBg.reference,
  [$color.variable]: colors.light.text.primary,
  _dark: {
    [$popperBg.variable]: colors.dark.background[1],
    [$color.variable]: colors.dark.text.primary,
  },
  bg: $popperBg.reference,
  color: $color.reference,
  border: 'none',
  _focusVisible: {
    boxShadow: 'none',
  },
});

const baseStyleHeader = defineStyle({
  px: sizes['3'],
  py: sizes['2'],
});

const baseStyleBody = defineStyle({
  fontSize: typography.fontSizes['3.5'],
  lineHeight: sizes['5'],
  px: sizes['3'],
  py: sizes['2'],
});

const baseStyleFooter = defineStyle({
  px: sizes['3'],
  py: sizes['2'],
});

const baseStyleCloseButton = defineStyle({
  position: 'absolute',
  borderRadius: 'md',
  top: sizes['1'],
  insetEnd: sizes['2'],
  padding: sizes['2'],
});

const baseStyle = definePartsStyle({
  content: baseStyleContent,
  header: baseStyleHeader,
  body: baseStyleBody,
  footer: baseStyleFooter,
  closeButton: baseStyleCloseButton,
});

export const theme = defineMultiStyleConfig({
  baseStyle,
});
