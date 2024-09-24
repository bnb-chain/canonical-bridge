import { background } from '@bnb-chain/space';
import { rgba } from 'polished';

export const dark = {
  input: {
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
    inverse: '#FFFFFF',
    brand: '#FFE900',
    disabled: rgba('#5C5F6A', 0.45),
  },
  route: {
    background: { highlight: 'rgba(255, 233, 0, 0.06)' },
    border: '#373943',
    warning: '#BC4E00',
  },
  overlay: rgba('#14151A', 0.6),
  popover: {
    background: '#373943',
    selected: '#5C5F6A',
    shadow: ' 0px 4px 8px 0px rgba(0, 0, 0, 0.48)',
  },
};
