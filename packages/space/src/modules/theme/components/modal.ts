import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, cssVar, defineStyle } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

import { colors } from '../foundations/colors';
import { sizes } from '../foundations/sizes';
import { typography } from '../foundations/typography';

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(parts.keys);

const $bg = cssVar('modal-bg');
const $shadow = cssVar('modal-shadow');
const $color = cssVar('modal-color');

const baseStyleOverlay = defineStyle((props) => ({
  bg: mode(colors.light.overlay, colors.dark.overlay)(props),
  zIndex: 'modal',
}));

const baseStyleDialog = defineStyle((props) => {
  const { isCentered, scrollBehavior } = props;

  return {
    borderRadius: sizes['4'],
    my: isCentered ? 'auto' : sizes['4'],
    // mx: isCentered ? 'auto' : undefined,
    mx: sizes['4'],
    maxH: scrollBehavior === 'inside' ? 'calc(100% - 7.5rem)' : undefined,
    [$bg.variable]: colors.light.background[1],
    [$shadow.variable]: colors.light.shadow[4],
    [$color.variable]: colors.light.text.primary,
    _dark: {
      [$bg.variable]: colors.dark.background[1],
      [$shadow.variable]: colors.dark.shadow[4],
      [$color.variable]: colors.dark.text.primary,
    },
    bg: $bg.reference,
    boxShadow: $shadow.reference,
    color: $color.reference,
  };
});

const baseStyleDialogContainer = defineStyle((props) => {
  const { isCentered, scrollBehavior } = props;

  return {
    display: 'flex',
    zIndex: 'modal',
    justifyContent: 'center',
    alignItems: isCentered ? 'center' : 'flex-start',
    overflow: scrollBehavior === 'inside' ? 'hidden' : 'auto',
    overscrollBehaviorY: 'none',
  };
});

const baseStyleHeader = defineStyle({
  // Include close button size.
  px: { base: sizes['4'], md: sizes['10'] },
  pt: { base: sizes['4'], md: sizes['12'] },
  pb: 0,
  fontSize: { base: typography.fontSizes['5'], md: typography.fontSizes['6'] },
  lineHeight: { base: typography.fontSizes['7'], md: typography.fontSizes['8'] },
  fontWeight: '700',
});

const baseStyleCloseButton = defineStyle({
  position: 'absolute',
  top: { base: sizes['4'], md: sizes['6'] },
  insetEnd: { base: sizes['4'], md: sizes['6'] },
  // Button with `ghost` variant.
  [$color.variable]: colors.light.button.primary.default,
  _dark: {
    [$color.variable]: colors.dark.button.primary.default,
  },
  color: $color.reference,
  _hover: {
    bg: 'transparent',
    [$color.variable]: colors.light.button.primary.hover,
    _dark: {
      [$color.variable]: colors.dark.button.primary.hover,
    },
  },
  _focusVisible: {
    boxShadow: 'none',
  },
});

const baseStyleBody = defineStyle({
  px: { base: sizes['4'], md: sizes['10'] },
  pt: sizes['2'],
  pb: sizes['6'],
});

const baseStyleFooter = defineStyle({
  px: { base: sizes['4'], md: sizes['10'] },
  pt: 0,
  pb: { base: sizes['8'], md: sizes['10'] },
});

const baseStyle = definePartsStyle((props) => ({
  overlay: baseStyleOverlay(props),
  dialogContainer: baseStyleDialogContainer(props),
  dialog: baseStyleDialog(props),
  header: baseStyleHeader,
  closeButton: baseStyleCloseButton,
  body: baseStyleBody,
  footer: baseStyleFooter,
}));

/**
 * Since the `maxWidth` prop references theme.sizes internally,
 * we can leverage that to size our modals.
 */
function getSize(value: string) {
  if (value === 'full') {
    return definePartsStyle({
      dialog: {
        maxW: '100vw',
        minH: '$100vh',
        my: '0',
        borderRadius: '0',
      },
    });
  }
  return definePartsStyle({
    dialog: { maxW: value },
  });
}

const mSizes = {
  xs: getSize('xs'),
  sm: getSize('sm'),
  md: getSize('md'),
  lg: getSize('lg'),
  xl: getSize('xl'),
  '2xl': getSize('2xl'),
  '3xl': getSize('3xl'),
  '4xl': getSize('4xl'),
  '5xl': getSize('5xl'),
  '6xl': getSize('6xl'),
  full: getSize('full'),
};

export const theme = defineMultiStyleConfig({
  baseStyle,
  sizes: mSizes,
  defaultProps: { size: 'md' },
});
