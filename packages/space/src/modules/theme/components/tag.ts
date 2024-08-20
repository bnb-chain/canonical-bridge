import { tagAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, cssVar, defineStyle } from '@chakra-ui/styled-system';

import { BADGE_STYLES, DEFAULT_PROPS } from '../internal/badge';
import { sizes } from '../foundations/sizes';

import { theme as badgeTheme, vars as badgeVars } from './badge';

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(parts.keys);

const $bg = cssVar('tag-bg');
const $color = cssVar('tag-color');
const $shadow = cssVar('tag-shadow');

const baseStyleContainer = defineStyle({
  [$color.variable]: badgeVars.color.reference,
  [$bg.variable]: badgeVars.bg.reference,
  [$shadow.variable]: badgeVars.shadow.reference,

  color: $color.reference,
  bg: $bg.reference,
  boxShadow: $shadow.reference,
  borderRadius: sizes['10'],
});

const baseStyle = definePartsStyle({
  container: baseStyleContainer,
});

const variants = {
  subtle: definePartsStyle((props) => ({
    container: badgeTheme.variants?.subtle(props),
  })),
  solid: definePartsStyle((props) => ({
    container: badgeTheme.variants?.solid(props),
  })),
  outline: definePartsStyle((props) => ({
    container: badgeTheme.variants?.outline(props),
  })),
  grayscale: definePartsStyle((props) => ({
    container: badgeTheme.variants?.grayscale(props),
  })),
};

export const theme = defineMultiStyleConfig({
  variants,
  baseStyle,
  sizes: {
    lg: definePartsStyle({
      container: {
        ...BADGE_STYLES['lg'],
      },
    }),
    md: definePartsStyle({
      container: {
        ...BADGE_STYLES['md'],
      },
    }),
    sm: definePartsStyle({
      container: {
        ...BADGE_STYLES['sm'],
      },
    }),
  },
  defaultProps: DEFAULT_PROPS,
});
