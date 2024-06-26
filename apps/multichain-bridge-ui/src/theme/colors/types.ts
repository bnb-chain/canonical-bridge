export const COLOR_SCHEMES = [
  'primary',
  'secondary',
  'brand',
  'success',
  'danger',
] as const;
export type ColorScheme = (typeof COLOR_SCHEMES)[number];

export type ColorType = {
  primitives: {
    logo: string;
    white: string;
    black: string;
  };

  background: {
    1: string;
    2: string;
    3: string;
    brand: string;
  };
  border: {
    1: string;
    2: string;
    3: string;
    4: string;
    inverse: string;
    brand: string;
    disabled: string;
  };
  layer: {
    1: {
      default: string;
      hover: string;
      active: string;
    };
    2: {
      default: string;
      hover: string;
      active: string;
    };
    3: {
      default: string;
      hover: string;
      active: string;
    };
    4: {
      default: string;
      hover: string;
      active: string;
    };
    inverse: string;
    disabled: string;
  };
  support: {
    success: {
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
    };
    warning: {
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
    };
    danger: {
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
    };
    brand: {
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
    };
    primary: {
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
    };
  };
  shadow: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    // 6: string;
    // 7: string;
    // 8: string;
    // 9: string;
    // 10: string;
  };
  gradient: {
    1: string;
  };
  overlay: string;

  // Components.

  button: {
    primary: {
      default: string;
      subtle: string;
      hover: string;
      active: string;
    };
    brand: {
      default: string;
      subtle: string;
      hover: string;
      active: string;
    };
    success: {
      default: string;
      subtle: string;
      hover: string;
      active: string;
    };
    warning: {
      default: string;
      subtle: string;
      hover: string;
      active: string;
    };
    danger: {
      default: string;
      subtle: string;
      hover: string;
      active: string;
    };
    greenfield: {
      default: string;
      subtle: string;
      hover: string;
      active: string;
    };
    disabled: string;
  };
  input: {
    1: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    placeholder: string;
    inverse: string;
    disabled: string;
    brand: string;
    greenfield: string;
    warning: string;
    danger: string;
    on: {
      color: {
        primary: string;
        disabled: string;
      };
    };
  };
};
