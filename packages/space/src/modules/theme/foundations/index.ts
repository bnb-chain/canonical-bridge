import { breakpoints } from './breakpoints';
import { colors } from './colors';
import { config } from './config';
import { shadows } from './shadows';
import { sizes } from './sizes';
import { styles } from './styles';
import { typography } from './typography';

export type FoundationsType = {
  breakpoints: typeof breakpoints;
  colors: typeof colors;
  config: typeof config;
  shadows: typeof shadows;
  sizes: typeof sizes;
  styles: typeof styles;
  fontSizes: typeof typography['fontSizes'];
  fontWeights: typeof typography['fontWeights'];
  fonts: typeof typography['fonts'];
};

export const foundations: FoundationsType = {
  breakpoints,
  colors,
  config,
  shadows,
  sizes,
  styles,
  ...typography,
};
