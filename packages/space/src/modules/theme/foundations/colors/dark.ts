import { rgba } from 'polished';

import { sizes } from '../sizes';

import { primitives } from './primitives';
import { ColorType } from './types';

export const dark: ColorType = {
  primitives: {
    logo: primitives.logo,
    white: primitives.white,
    black: primitives.black,
  },

  background: {
    1: primitives.graphite[900],
    2: primitives.graphite[800],
    3: primitives.graphite[1000],
    brand: primitives.yellow[500],
  },
  border: {
    1: primitives.graphite[900],
    2: primitives.graphite[800],
    3: primitives.graphite[700],
    4: primitives.graphite[600],
    inverse: primitives.white,
    brand: primitives.yellow[500],
    disabled: rgba(primitives.graphite[600], 0.45),
  },
  layer: {
    1: {
      default: primitives.graphite[1000],
      hover: primitives.graphite[900],
      active: primitives.graphite[800],
    },
    2: {
      default: primitives.graphite[900],
      hover: primitives.graphite[800],
      active: primitives.graphite[700],
    },
    3: {
      default: primitives.graphite[800],
      hover: primitives.graphite[700],
      active: primitives.graphite[600],
    },
    4: {
      default: primitives.graphite[700],
      hover: primitives.graphite[600],
      active: primitives.graphite[500],
    },
    inverse: primitives.graphite[100],
    disabled: rgba(primitives.graphite[100], 0.2),
  },
  support: {
    success: {
      1: primitives.green[200],
      2: primitives.green[400],
      3: primitives.green[500],
      4: primitives.green[700],
      5: primitives.green[900],
    },
    warning: {
      1: primitives.orange[100],
      2: primitives.orange[400],
      3: primitives.orange[500],
      4: primitives.orange[700],
      5: primitives.orange[900],
    },
    danger: {
      1: primitives.red[200],
      2: primitives.red[400],
      3: primitives.red[500],
      4: primitives.red[700],
      5: primitives.red[900],
    },
    brand: {
      1: primitives.yellow[200],
      2: primitives.yellow[400],
      3: primitives.yellow[500],
      4: primitives.yellow[800],
      5: primitives.yellow[1000],
    },
    primary: {
      1: primitives.graphite[300],
      2: primitives.graphite[400],
      3: primitives.graphite[500],
      4: primitives.graphite[600],
      5: primitives.graphite[700],
    },
  },
  shadow: {
    // 1: `${sizes['0']} ${sizes['4']} ${sizes['12']} ${rgba(primitives.black, 0.24)}`,
    // 2: `${sizes['0']} ${sizes['4']} ${sizes['12']} ${rgba(primitives.black, 0.16)}`,
    // 3: `${sizes['0']} ${sizes['6']} ${sizes['16']} ${rgba(primitives.black, 0.48)}`,
    // 4: `${sizes['0']} ${sizes['1']} ${sizes['2']} ${rgba(primitives.black, 0.56)}`,

    1: `${sizes['0']} ${sizes['1']} ${sizes['2']} ${rgba(primitives.black, 0.16)}`,
    2: `${sizes['0']} ${sizes['1']} ${sizes['2']} ${rgba(primitives.black, 0.24)}`,
    3: `${sizes['0']} ${sizes['2']} ${sizes['4']} ${rgba(primitives.black, 0.24)}`,
    4: `${sizes['0']} ${sizes['1']} ${sizes['2']} ${rgba(primitives.black, 0.16)},${sizes['0']} ${
      sizes['4']
    } ${sizes['12']} ${rgba(primitives.black, 0.48)}`,
    5: `${sizes['0']} ${sizes['1']} ${sizes['2']} ${rgba(primitives.black, 0.16)},${sizes['0']} ${
      sizes['6']
    } ${sizes['16']} ${rgba(primitives.black, 0.56)}`,
  },
  gradient: {
    1: `linear-gradient(180deg, ${primitives.graphite[1000]} 0%, ${primitives.black} 100%)`,
  },
  overlay: rgba(primitives.graphite[1000], 0.6),
  button: {
    primary: {
      default: primitives.graphite[100],
      subtle: primitives.graphite[600],
      hover: primitives.graphite[300],
      active: primitives.white,
    },
    brand: {
      default: primitives.yellow[500],
      subtle: rgba(primitives.yellow[1000], 0.25),
      hover: primitives.yellow[600],
      active: primitives.yellow[400],
    },
    success: {
      default: primitives.green[500],
      subtle: rgba(primitives.green[1000], 0.5),
      hover: primitives.green[600],
      active: primitives.green[400],
    },
    warning: {
      default: primitives.orange[500],
      subtle: rgba(primitives.orange[1000], 0.5),
      hover: primitives.orange[600],
      active: primitives.orange[400],
    },
    danger: {
      default: primitives.red[500],
      subtle: rgba(primitives.red[1000], 0.45),
      hover: primitives.red[600],
      active: primitives.red[400],
    },
    greenfield: {
      default: primitives.greenfield[500],
      subtle: rgba(primitives.greenfield[1000], 0.6),
      hover: primitives.greenfield[600],
      active: primitives.greenfield[400],
    },
    disabled: rgba(primitives.graphite[100], 0.45),
  },
  input: {
    1: primitives.graphite[700],
  },
  text: {
    primary: primitives.white,
    secondary: primitives.graphite[400],
    tertiary: primitives.graphite[500],
    placeholder: primitives.graphite[500],
    inverse: primitives.graphite[900],
    disabled: rgba(primitives.graphite[100], 0.45),
    brand: primitives.yellow[500],
    greenfield: primitives.greenfield[500],
    warning: primitives.orange[400],
    danger: primitives.red[400],
    on: {
      color: {
        primary: primitives.graphite[900],
        disabled: rgba(primitives.graphite[900], 0.45),
      },
    },
  },
};
