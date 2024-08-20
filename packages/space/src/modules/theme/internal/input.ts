import { sizes } from '../foundations/sizes';
import { typography } from '../foundations/typography';

export const DEFAULT_PROPS = {
  size: 'md',
  variant: 'outline',
} as const;

const STYLES = {
  '2xl': {
    fontSize: typography.fontSizes['4'],
    lineHeight: typography.fontSizes['6'],
    px: sizes['6'],
    h: sizes['16'],
    borderRadius: sizes['2'],
  },
  xl: {
    fontSize: typography.fontSizes['4'],
    lineHeight: typography.fontSizes['6'],
    px: sizes['4'],
    h: sizes['14'],
    borderRadius: sizes['2'],
  },
  lg: {
    fontSize: typography.fontSizes['4'],
    lineHeight: typography.fontSizes['6'],
    px: sizes['4'],
    h: sizes['12'],
    borderRadius: sizes['2'],
  },
  md: {
    fontSize: typography.fontSizes['3.5'],
    lineHeight: typography.fontSizes['4'],
    px: sizes['4'],
    h: sizes['10'],
    borderRadius: sizes['2'],
  },
  sm: {
    fontSize: typography.fontSizes['3.5'],
    lineHeight: typography.fontSizes['4'],
    px: sizes['4'],
    h: sizes['8'],
    borderRadius: sizes['2'],
  },
  // TODO: Size `xs` not in Figma.
  xs: {
    fontSize: typography.fontSizes['3'],
    px: sizes['2'],
    h: sizes['6'],
    borderRadius: sizes['1'],
  },
};

export { STYLES as INPUT_STYLES };
