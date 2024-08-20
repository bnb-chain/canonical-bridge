import { typography } from '../foundations/typography';

const FONT_FAMILIES = {
  ZEN_DOTS: `'Zen Dots', sans-serif`,
  SPACE_GROTESK: `'Space Grotesk', sans-serif`,
};

const STYLES = {
  display: {
    lg: {
      fontFamily: FONT_FAMILIES.ZEN_DOTS,
      fontSize: typography.fontSizes['20'],
      fontWeight: '400',
      lineHeight: typography.fontSizes['22'],
      letterSpacing: typography.letterSpacings.wider,
    },
    md: {
      fontFamily: FONT_FAMILIES.ZEN_DOTS,
      fontSize: typography.fontSizes['16'],
      fontWeight: '400',
      lineHeight: typography.fontSizes['18'],
      letterSpacing: typography.letterSpacings.wider,
    },
    sm: {
      fontFamily: FONT_FAMILIES.ZEN_DOTS,
      fontSize: typography.fontSizes['12'],
      fontWeight: '400',
      lineHeight: typography.fontSizes['14'],
      letterSpacing: typography.letterSpacings.wider,
    },
    xs: {
      fontFamily: FONT_FAMILIES.ZEN_DOTS,
      fontSize: typography.fontSizes['8'],
      fontWeight: '400',
      lineHeight: typography.fontSizes['10'],
      letterSpacing: typography.letterSpacings.wider,
    },
    '2xs': {
      fontFamily: FONT_FAMILIES.ZEN_DOTS,
      fontSize: typography.fontSizes['6'],
      fontWeight: '400',
      lineHeight: typography.fontSizes['8'],
      letterSpacing: typography.letterSpacings.wider,
    },
  },
  heading: {
    lg: {
      fontFamily: FONT_FAMILIES.SPACE_GROTESK,
      fontSize: typography.fontSizes['12'],
      fontWeight: '400',
      lineHeight: typography.fontSizes['14'],
    },
    md: {
      fontFamily: FONT_FAMILIES.SPACE_GROTESK,
      fontSize: typography.fontSizes['8'],
      fontWeight: '400',
      lineHeight: typography.fontSizes['10'],
    },
    sm: {
      fontFamily: FONT_FAMILIES.SPACE_GROTESK,
      fontSize: typography.fontSizes['6'],
      fontWeight: '400',
      lineHeight: typography.fontSizes['8'],
    },
    xs: {
      fontFamily: FONT_FAMILIES.SPACE_GROTESK,
      fontSize: typography.fontSizes['5'],
      fontWeight: '400',
      lineHeight: typography.fontSizes['7'],
    },
  },
  body: {
    lg: {
      fontFamily: FONT_FAMILIES.SPACE_GROTESK,
      fontSize: typography.fontSizes['5'],
      fontWeight: '400',
      lineHeight: typography.fontSizes['7'],
    },
    md: {
      fontFamily: FONT_FAMILIES.SPACE_GROTESK,
      fontSize: typography.fontSizes['4'],
      fontWeight: '400',
      lineHeight: typography.fontSizes['6'],
    },
    sm: {
      fontFamily: FONT_FAMILIES.SPACE_GROTESK,
      fontSize: typography.fontSizes['3.5'],
      fontWeight: '400',
      lineHeight: typography.fontSizes['5'],
    },
  },
  label: {
    lg: {
      fontFamily: FONT_FAMILIES.SPACE_GROTESK,
      fontSize: typography.fontSizes['4'],
      fontWeight: '400',
      lineHeight: typography.fontSizes['6'],
    },
    md: {
      fontFamily: FONT_FAMILIES.SPACE_GROTESK,
      fontSize: typography.fontSizes['3.5'],
      fontWeight: '400',
      lineHeight: typography.fontSizes['4'],
    },
    sm: {
      fontFamily: FONT_FAMILIES.SPACE_GROTESK,
      fontSize: typography.fontSizes['3'],
      fontWeight: '400',
      lineHeight: typography.fontSizes['4'],
    },
  },
} as const;

export { STYLES as TYPOGRAPHY_STYLES };
