import { rgba } from 'polished';

import { dark } from './dark';
import type { ColorType } from './types';

export const light: ColorType = {
  primitives: {
    logo: '#F0B90B',
    white: '#FFFFFF',
    black: '#000000',
  },
  input: {
    1: '#F7F7F8',
    border: '#E1E2E5',
    background: '#FFFFFF',
    title: '#8C8F9B',
  },
  text: {
    primary: '#181A1E',
    secondary: '#5C5F6A',
    tertiary: '#5C5F6A',
    placeholder: '#8C8F9B',
    inverse: '#FFFFFF',
    disabled: rgba('#181A1E', 0.3),
    brand: '#181A1E',
    warning: '#BC4E00',
    danger: '#EF2A37',
    route: { title: '#5C5F6A' },

    on: {
      color: {
        primary: '#FFFFFF',
        disabled: rgba('#FFFFFF', 0.4),
      },
    },
  },
  button: {
    wallet: {
      text: '#181A1E',
      background: { default: '#FFE900', hover: '#E1E2E5' },
    },
    refresh: {
      text: '#FFFAC2',
    },
    select: {
      text: '#FFFFFF',
      arrow: '#C4C5CB',
      border: '#373943',
      background: { default: '#1E2026', hover: '#373943' },
    },
    primary: {
      default: '#181A1E',
      subtle: '#E1E2E5',
      hover: '#1E2026',
      active: '#373943',
    },
    brand: {
      default: '#C2B100',
      subtle: '#FFFAC2',
      hover: '#948700',
      active: '#857900',
    },
    success: {
      default: '#12A55E',
      subtle: '#BFF8DC',
      hover: '#0E8149',
      active: '#115F39',
    },
    danger: {
      default: '#D31724',
      subtle: '#FDE2E4',
      hover: '#A91E27',
      active: '#821119',
    },
    disabled: rgba('#181A1E', 0.4),
  },
  modal: {
    title: '#5C5F6A',
    item: {
      text: { primary: '#181A1E', secondary: '#5C5F6A' },
      background: { default: '#F7F7F8', hover: '#F7F7F8' },
    },
    back: {
      default: '#8C8F9B',
      hover: '#181A1E',
    },
    close: {
      default: '#8C8F9B',
      hover: '#181A1E',
    },
  },
  background: {
    1: '#FFFFFF',
    2: '#F7F7F8',
    3: '#F1F2F3',
    brand: '#FFE900',
    modal: '#F7F7F8',
    main: '#FFFFFF',
    route: '#F7F7F8',
    warning: '#FFEADB',
    tag: '#E1E2E5',
  },
  border: {
    1: '#F7F7F8',
    2: '#F1F2F3',
    3: '#E1E2E5',
    4: '#E1E2E5',
    inverse: '#181A1E',
    brand: '#EBD600',
    disabled: '#C4C5CB',
  },
  layer: {
    1: {
      default: '#FFFFFF',
      hover: '#E1E2E5',
      active: '#C4C5CB',
    },
    2: {
      default: '#F1F2F3',
      hover: '#E1E2E5',
      active: '#C4C5CB',
    },
    3: {
      default: '#FFFFFF',
      hover: '#E1E2E5',
      active: '#C4C5CB',
    },
    4: {
      default: '#F1F2F3',
      hover: '#E1E2E5',
      active: '#C4C5CB',
    },
    inverse: '#181A1E',
    disabled: rgba('#181A1E', 0.15),
  },
  support: {
    success: {
      1: '#115F39',
      2: '#0E8149',
      3: '#15C16E',
      4: '#53EAA1',
      5: '#BFF8DC',
    },
    warning: {
      1: '#5C2600',
      2: '#933D00',
      3: '#E55F00',
      4: '#FFA260',
      5: '#FFEADB',
    },
    danger: {
      // 1: '#821119',
      // 2: '#A91E27',
      3: '#EF2A37',
      // 4: '#FF7A84',
      // 5: '#FDC4C7',
    },
    brand: {
      3: '#EBD600',
      4: '#FFE900',
      5: '#FFFAC2',
    },
    primary: {
      1: '#373943',
      2: '#5C5F6A',
      3: '#8C8F9B',
      4: '#C4C5CB',
      5: '#E1E2E5',
    },
  },
  shadow: {
    1: `0 4px 8px ${rgba('#000000', 0.16)}`,
    2: `0 4px 8px ${rgba('#000000', 0.24)}`,
    3: `0 8px 16px ${rgba('#000000', 0.24)}`,
    4: `0 4px 8px ${rgba('#000000', 0.16)}, 0 16px 48px ${rgba('#000000', 0.24)}`,
    5: `0 4px 8px ${rgba('#000000', 0.16)}, 0 24px 64px ${rgba('#000000', 0.48)}`,
  },
  gradient: {
    ...dark.gradient,
  },
  overlay: rgba('#14151A', 0.2),
};
