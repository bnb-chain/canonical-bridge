import { dark } from './dark';
import { light } from './light';

export const colors = {
  colors: {
    light: {
      ...light,
    },
    dark: {
      ...dark,
    },
  },
  shadows: {
    light: {
      ...light.shadow,
    },
    dark: {
      ...dark.shadow,
    },
  },
};
