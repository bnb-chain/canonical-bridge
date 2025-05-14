import { rgba } from 'polished';

export const dark = {
  primitives: {
    logo: '#F0B90B',
    white: '#FFFFFF',
    black: '#000000',
  },
  input: {
    1: '#373943',
    background: '#1E2026',
    title: '#8C8F9B',
    border: {
      default: '#373943',
      hover: '#5C5F6A',
      active: '#FFE900',
    },
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#C4C5CB',
    tertiary: '#8C8F9B',
    placeholder: '#8C8F9B',
    inverse: '#181A1E',
    disabled: rgba('#F7F7F8', 0.45),
    brand: '#FFE900',
    warning: '#FFEADB',
    danger: '#F8545F',
    route: { title: '#8C8F9B' },
    network: {
      title: '#8C8F9B',
    },
    on: {
      color: {
        primary: '#181A1E',
        disabled: rgba('#181A1E', 0.45),
      },
    },
  },
  button: {
    wallet: {
      text: '#181A1E',
      background: { default: '#FFE900', hover: '#EBD600' },
    },
    refresh: {
      text: '#665800',
    },
    select: {
      text: '#FFFFFF',
      arrow: '#C4C5CB',
      border: '#373943',
      background: { default: '#1E2026', hover: '#373943' },
    },
    primary: {
      default: '#F7F7F8',
      subtle: '#5C5F6A',
      hover: '#E1E2E5',
      active: '#FFFFFF',
    },
    brand: {
      default: '#FFE900',
      subtle: rgba('#665800', 0.25),
      hover: '#EBD600',
      active: '#FFF15C',
    },
    success: {
      default: '#18DC7E',
      subtle: rgba('#143D29', 0.5),
      hover: '#15C16E',
      active: '#53EAA1',
    },
    danger: {
      default: '#F8545F',
      subtle: rgba('#541C20', 0.45),
      hover: '#EF2A37',
      active: '#FF7A84',
    },
    exchange: {
      default: '#373943',
      hover: '#E1E2E5',
    },
    disabled: rgba('#F7F7F8', 0.45),
  },
  modal: {
    title: '#C4C5CB',
    item: {
      text: { primary: '#FFFFFF', secondary: '#C4C5CB' },
      background: { default: '#1E2026', hover: '#373943' },
    },
    back: {
      default: '#8C8F9B',
      hover: '#FFFFFF',
    },
    close: {
      default: '#8C8F9B',
      hover: '#FFFFFF',
    },
  },
  background: {
    1: '#181A1E',
    2: '#1E2026',
    3: '#14151A',
    brand: '#FFE900',
    modal: '#1E2026',
    main: '#181A1E',
    route: '#1E2026',
    warning: '#5C2600',
    tag: '#373943',
    body: '#14151A',
  },
  receive: {
    background: '#373943',
  },
  border: {
    1: '#181A1E',
    2: '#1E2026',
    3: '#373943',
    4: '#5C5F6A',
    inverse: '#FFFFFF',
    brand: '#FFE900',
    disabled: rgba('#5C5F6A', 0.45),
  },
  route: {
    background: { highlight: 'rgba(255, 233, 0, 0.06)' },
    border: '#373943',
  },
  layer: {
    1: {
      default: '#14151A',
      hover: '#181A1E',
      active: '#1E2026',
    },
    2: {
      default: '#181A1E',
      hover: '#1E2026',
      active: '#373943',
    },
    3: {
      default: '#1E2026',
      hover: '#373943',
      active: '#5C5F6A',
    },
    4: {
      default: '#373943',
      hover: '#5C5F6A',
      active: '#8C8F9B',
    },
    inverse: '#F7F7F8',
    disabled: rgba('#F7F7F8', 0.2),
  },
  support: {
    success: {
      1: '#BFF8DC',
      2: '#53EAA1',
      3: '#18DC7E',
      4: '#12A55E',
      5: '#115F39',
    },
    warning: {
      1: '#FFEADB',
      2: '#FFA260',
      3: '#FF8A38',
      4: '#BC4E00',
      5: '#5C2600',
    },
    danger: {
      3: '#F8545F',
    },
    brand: {
      1: '#FFFAC2',
      2: '#FFF15C',
      3: '#FFE900',
      4: '#948700',
      5: '#665800',
    },
    primary: {
      1: '#E1E2E5',
      2: '#C4C5CB',
      3: '#8C8F9B',
      4: '#5C5F6A',
      5: '#373943',
    },
  },
  shadow: {
    1: `0px 4px 8px ${rgba('#000000', 0.16)}`,
    2: `0px 4px 8px ${rgba('#000000', 0.24)}`,
    3: `0px 8px 16px ${rgba('#000000', 0.24)}`,
    4: `0px 4px 8px ${rgba('#000000', 0.16)},0px 16px 48px ${rgba('#000000', 0.48)}`,
    5: `0px 4px 8px ${rgba('#000000', 0.16)},0px 24px 64px ${rgba('#000000', 0.56)}`,
  },
  gradient: {
    1: `linear-gradient(180deg, ${'#14151A'} 0%, ${'#000000'} 100%)`,
  },
  overlay: rgba('#14151A', 0.6),
  popover: {
    background: '#373943',
    selected: '#5C5F6A',
    shadow: ' 0px 4px 8px 0px rgba(0, 0, 0, 0.48)',
    separator: '#5C5F6A',
  },
  ratio: {
    success: {
      bg: rgba('#53eaa1', 0.05),
      borderColor: rgba('#53eaa1', 0.15),
      color: '#53eaa1',
    },
    normal: {
      bg: rgba('#548fee', 0.05),
      borderColor: rgba('#548fee', 0.15),
      color: '#548fee',
    },
    warning: {
      bg: rgba('#ffa260', 0.05),
      borderColor: rgba('#ffa260', 0.15),
      color: '#ffa260',
    },
    error: {
      bg: rgba('#ff7a84', 0.05),
      borderColor: rgba('#ff7a84', 0.15),
      color: '#ff7a84',
    },
  },
};

export type ColorType = typeof dark;
