import { theme } from '../../../modules/theme';
import { CLASS_NAMES } from '../../constants';

export const STYLES = {
  [CLASS_NAMES.BUTTON__ICON]: {
    '2xl': {
      mr: theme.sizes['3'],
    },
    xl: {
      mr: theme.sizes['2'],
    },
    lg: {
      mr: theme.sizes['2'],
    },
    md: {
      mr: theme.sizes['2'],
    },
    sm: {
      mr: theme.sizes['2'],
    },
    xs: {
      mr: theme.sizes['1'],
    },
  },
  [CLASS_NAMES.ICON]: {
    '2xl': {
      fontSize: theme.fontSizes['6'],
    },
    xl: {
      fontSize: theme.fontSizes['6'],
    },
    lg: {
      fontSize: theme.fontSizes['6'],
    },
    md: {
      fontSize: theme.fontSizes['4'],
    },
    sm: {
      fontSize: theme.fontSizes['4'],
    },
    xs: {
      fontSize: theme.fontSizes['3'],
    },
  },
};
