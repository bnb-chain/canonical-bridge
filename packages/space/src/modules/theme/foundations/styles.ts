import { theme } from '@chakra-ui/react';
import { StyleFunctionProps } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';
import { rgba } from 'polished';

import { colors } from './colors';

export const styles = {
  global: (props: StyleFunctionProps) => ({
    body: {
      color: mode(colors.light.text.primary, colors.dark.text.primary)(props),
      bg: mode(colors.light.background[1], colors.dark.background[1])(props),
      fontSize: '1rem',
      margin: 0,
      WebkitOverflowScrolling: 'touch',
    },
    // Add hover styles here,
    // If we add `_hover` to custom `Button` component, the theme `_hover` styles get overridden.
    '.chakra-button': {
      _hover: {
        '.chakra-button__right-addon': {
          borderColor: rgba(mode(colors.light.border[1], colors.dark.border[1])(props), 0.15),
        },
      },
    },
    '.chakra-toast': {
      '.chakra-toast__inner': {
        minW: '325px',
      },
    },
    // The arrow gets covered since we add a shadow to tooltips.
    // Need to override the inline styles from Popper.
    '.chakra-tooltip__arrow-wrapper': {
      zIndex: `${theme.zIndices.popover + 1} !important`,
    },
  }),
};
