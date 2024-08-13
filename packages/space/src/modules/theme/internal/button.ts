import { foundations } from '../foundations';

export const DEFAULT_PROPS = {
  variant: 'solid',
  size: 'md',
  colorScheme: 'primary',
} as const;

const STYLES = {
  '2xl': {
    h: foundations.sizes['16'],
    fontSize: foundations.fontSizes['4'],
    lineHeight: foundations.fontSizes['6'],
  },
  xl: {
    h: foundations.sizes['14'],
    fontSize: foundations.fontSizes['4'],
    lineHeight: foundations.fontSizes['6'],
  },
  lg: {
    h: foundations.sizes['12'],
    fontSize: foundations.fontSizes['4'],
    lineHeight: foundations.fontSizes['6'],
  },
  md: {
    h: foundations.sizes['10'],
    fontSize: foundations.fontSizes['3.5'],
    lineHeight: foundations.fontSizes['4'],
  },
  sm: {
    h: foundations.sizes['8'],
    fontSize: foundations.fontSizes['3.5'],
    lineHeight: foundations.fontSizes['4'],
  },
  xs: {
    h: foundations.sizes['6'],
    fontSize: foundations.fontSizes['3.5'],
    lineHeight: foundations.fontSizes['4'],
  },
};

export { STYLES as BUTTON_STYLES };
