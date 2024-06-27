import { rgba } from 'polished';

import { primitives, sizes } from './primitives';
import { dark } from './dark';
import type { ColorType } from './types';

export const light: ColorType = {
  primitives: {
    logo: primitives.logo,
    white: primitives.white,
    black: primitives.black,
  },

  background: {
    1: primitives.white,
    2: primitives.graphite[100],
    3: primitives.graphite[200],
    brand: primitives.yellow[500],
  },
  border: {
    1: primitives.graphite[100],
    2: primitives.graphite[200],
    3: primitives.graphite[300],
    4: primitives.graphite[300],
    inverse: primitives.graphite[900],
    brand: primitives.yellow[600],
    disabled: primitives.graphite[400],
  },
  layer: {
    1: {
      default: primitives.white,
      hover: primitives.graphite[300],
      active: primitives.graphite[400],
    },
    2: {
      default: primitives.graphite[200],
      hover: primitives.graphite[300],
      active: primitives.graphite[400],
    },
    3: {
      default: primitives.white,
      hover: primitives.graphite[300],
      active: primitives.graphite[400],
    },
    4: {
      default: primitives.graphite[200],
      hover: primitives.graphite[300],
      active: primitives.graphite[400],
    },
    inverse: primitives.graphite[900],
    disabled: rgba(primitives.graphite[900], 0.15),
  },
  support: {
    success: {
      1: primitives.green[900],
      2: primitives.green[800],
      3: primitives.green[600],
      4: primitives.green[400],
      5: primitives.green[200],
    },
    warning: {
      1: primitives.orange[900],
      2: primitives.orange[800],
      3: primitives.orange[600],
      4: primitives.orange[400],
      5: primitives.orange[100],
    },
    danger: {
      1: primitives.red[900],
      2: primitives.red[800],
      3: primitives.red[600],
      4: primitives.red[400],
      5: primitives.red[200],
    },
    brand: {
      1: primitives.yellow[1000],
      2: primitives.yellow[800],
      3: primitives.yellow[600],
      4: primitives.yellow[500],
      5: primitives.yellow[200],
    },
    primary: {
      1: primitives.graphite[700],
      2: primitives.graphite[600],
      3: primitives.graphite[500],
      4: primitives.graphite[400],
      5: primitives.graphite[300],
    },
  },
  shadow: {
    // 1: `${sizes['0']} ${sizes['4']} ${sizes['12']} ${rgba(primitives.black, 0.24)}`,
    // 2: `${sizes['0']} ${sizes['2']} ${sizes['8']} ${rgba(primitives.black, 0.16)}`,
    // 3: `${sizes['0']} ${sizes['6']} ${sizes['16']} ${rgba(primitives.black, 0.32)}`,
    // 4: `${sizes['0']} ${sizes['1']} ${sizes['2']} ${rgba(primitives.black, 0.4)}`,

    1: `${sizes['0']} ${sizes['1']} ${sizes['2']} ${rgba(
      primitives.black,
      0.16
    )}`,
    2: `${sizes['0']} ${sizes['1']} ${sizes['2']} ${rgba(
      primitives.black,
      0.24
    )}`,
    3: `${sizes['0']} ${sizes['2']} ${sizes['4']} ${rgba(
      primitives.black,
      0.24
    )}`,
    4: `${sizes['0']} ${sizes['1']} ${sizes['2']} ${rgba(
      primitives.black,
      0.16
    )}, ${sizes['0']} ${sizes['4']} ${sizes['12']} ${rgba(
      primitives.black,
      0.24
    )}`,
    5: `${sizes['0']} ${sizes['1']} ${sizes['2']} ${rgba(
      primitives.black,
      0.16
    )}, ${sizes['0']} ${sizes['6']} ${sizes['16']} ${rgba(
      primitives.black,
      0.48
    )}`,
  },
  gradient: {
    ...dark.gradient,
  },
  overlay: rgba(primitives.graphite[1000], 0.2),
  button: {
    primary: {
      default: primitives.graphite[900],
      subtle: primitives.graphite[300],
      hover: primitives.graphite[800],
      active: primitives.graphite[700],
    },
    brand: {
      default: primitives.yellow[700],
      subtle: primitives.yellow[200],
      hover: primitives.yellow[800],
      active: primitives.yellow[900],
    },
    success: {
      default: primitives.green[700],
      subtle: primitives.green[200],
      hover: primitives.green[800],
      active: primitives.green[900],
    },
    warning: {
      default: primitives.orange[600],
      subtle: primitives.orange[200],
      hover: primitives.orange[700],
      active: primitives.orange[800],
    },
    danger: {
      default: primitives.red[700],
      subtle: primitives.red[100],
      hover: primitives.red[800],
      active: primitives.red[900],
    },
    greenfield: {
      default: primitives.greenfield[700],
      subtle: primitives.greenfield[200],
      hover: primitives.greenfield[800],
      active: primitives.greenfield[900],
    },
    disabled: rgba(primitives.graphite[900], 0.4),
  },
  input: {
    1: primitives.graphite[100],
  },
  text: {
    primary: primitives.graphite[900],
    secondary: primitives.graphite[600],
    tertiary: primitives.graphite[600],
    placeholder: primitives.graphite[500],
    inverse: primitives.white,
    disabled: rgba(primitives.graphite[900], 0.3),
    brand: primitives.graphite[900],
    greenfield: primitives.greenfield[700],
    warning: primitives.orange[700],
    danger: primitives.red[800],
    on: {
      color: {
        primary: primitives.white,
        disabled: rgba(primitives.white, 0.4),
      },
    },
  },
};
