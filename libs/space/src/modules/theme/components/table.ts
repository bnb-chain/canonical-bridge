import { tableAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

import { sizes } from '../foundations/sizes';

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  table: {
    fontVariantNumeric: 'lining-nums tabular-nums',
    borderCollapse: 'collapse',
    width: 'full',
  },
  th: {
    textAlign: 'start',
  },
  td: {
    textAlign: 'start',
  },
  caption: {
    mt: sizes['4'],
    textAlign: 'start',
  },
});

export const theme = defineMultiStyleConfig({
  baseStyle,
  sizes: {
    sm: definePartsStyle({
      th: {
        px: sizes['4'],
        py: sizes['1'],
      },
      td: {
        px: sizes['4'],
        py: sizes['2'],
      },
      caption: {
        px: sizes['4'],
        py: sizes['2'],
      },
    }),
    md: definePartsStyle({
      th: {
        px: sizes['6'],
        py: sizes['3'],
      },
      td: {
        px: sizes['6'],
        py: sizes['4'],
      },
      caption: {
        px: sizes['6'],
        py: sizes['2'],
      },
    }),
    lg: definePartsStyle({
      th: {
        px: sizes['8'],
        py: sizes['4'],
      },
      td: {
        px: sizes['8'],
        py: sizes['5'],
      },
      caption: {
        px: sizes['6'],
        py: sizes['2'],
      },
    }),
  },
  defaultProps: {
    size: 'md',
  },
});
