import { defineStyle } from '@chakra-ui/styled-system';

import { sizes } from '../foundations/sizes';

import { TYPOGRAPHY_STYLES } from './typography';

export const DEFAULT_PROPS = {
  variant: 'solid',
  size: 'md',
  colorScheme: 'primary',
} as const;

const STYLES = {
  lg: defineStyle({
    ...TYPOGRAPHY_STYLES['label']['lg'],
    fontWeight: '500',
    px: sizes['3'],
    py: sizes['2'],
  }),
  md: defineStyle({
    ...TYPOGRAPHY_STYLES['label']['md'],
    fontWeight: '500',
    px: sizes['3'],
    py: sizes['2'],
  }),
  sm: defineStyle({
    ...TYPOGRAPHY_STYLES['label']['sm'],
    fontWeight: '500',
    px: sizes['2'],
    py: sizes['1'],
  }),
};

export { STYLES as BADGE_STYLES };
