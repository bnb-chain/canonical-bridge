import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';

import { sizes } from '../foundations/sizes';

import { theme as inputTheme } from './input';

const baseStyle = defineStyle({
  ...inputTheme.baseStyle?.field,
  paddingY: sizes['2'],
  minHeight: sizes['5'],
  verticalAlign: 'top',
});

const variants = {
  outline: defineStyle((props) => inputTheme.variants?.outline(props).field ?? {}),
};

export const theme = defineStyleConfig({
  baseStyle,
  sizes: {
    sm: inputTheme.sizes?.sm.field ?? {},
    md: inputTheme.sizes?.md.field ?? {},
    lg: inputTheme.sizes?.lg.field ?? {},
    xl: inputTheme.sizes?.xl.field ?? {},
    '2xl': inputTheme.sizes?.['2xl'].field ?? {},
  },
  variants,
  defaultProps: {
    size: 'md',
    variant: 'outline',
  },
});
