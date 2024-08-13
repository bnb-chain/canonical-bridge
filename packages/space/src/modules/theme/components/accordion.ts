import { accordionAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/styled-system';

import { sizes } from '../foundations/sizes';
import { typography } from '../foundations/typography';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyleContainer = defineStyle({
  borderTopWidth: '1px',
  borderColor: 'inherit',
  _last: {
    borderBottomWidth: '1px',
  },
});

const baseStyleButton = defineStyle({
  transitionProperty: 'common',
  transitionDuration: 'normal',
  _focusVisible: {
    boxShadow: 'outline',
  },
  _hover: {},
  _disabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  px: sizes['4'],
  py: sizes['2'],
});

const baseStylePanel = defineStyle({
  pt: sizes['2'],
  px: sizes['4'],
  pb: sizes['5'],
});

const baseStyleIcon = defineStyle({
  fontSize: typography.fontSizes['5'],
});

const baseStyle = definePartsStyle({
  container: baseStyleContainer,
  button: baseStyleButton,
  panel: baseStylePanel,
  icon: baseStyleIcon,
});

export const theme = defineMultiStyleConfig({ baseStyle });
