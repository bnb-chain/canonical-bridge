import { tabsAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, cssVar, defineStyle } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

import { colors } from '../foundations/colors';
import { sizes } from '../foundations/sizes';
import { BUTTON_STYLES } from '../internal/button';

export const COLOR_SCHEMES = ['primary', 'brand', 'greenfield'] as const;
export type ColorScheme = typeof COLOR_SCHEMES[number];

const $fg = cssVar('tabs-color');
const $bg = cssVar('tabs-bg');

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(parts.keys);

const baseStyleTab = defineStyle((props) => {
  const { isFitted } = props;

  return {
    flex: isFitted ? 1 : undefined,
    transitionProperty: 'common',
    transitionDuration: 'normal',
    _focusVisible: {
      zIndex: 1,
      boxShadow: 'outline',
    },
    _disabled: {
      cursor: 'not-allowed',
      opacity: 1,
    },
  };
});

const baseStyleTabPanel = defineStyle({});

const baseStyle = definePartsStyle((props) => ({
  tab: baseStyleTab(props),
  tabpanel: baseStyleTabPanel,
}));

const variantLine = definePartsStyle((props) => {
  const colorScheme = props.colorScheme as ColorScheme;

  const { orientation } = props;
  const isVertical = orientation === 'vertical';
  const borderProp = isVertical ? 'borderStart' : 'borderBottom';
  const marginProp = isVertical ? 'marginStart' : 'marginBottom';

  const disabled = {
    [$fg.variable]: colors.light.text.disabled,
    borderColor: 'transparent',
    _selected: {
      _dark: {
        [$fg.variable]: colors.dark.text.disabled,
        borderColor: 'transparent',
      },
    },
    _active: {
      bg: 'none',
      _dark: {
        bg: 'none',
      },
    },
  };

  return {
    tablist: {
      [borderProp]: '2px solid',
      borderColor: mode(colors.light.border[3], colors.dark.border[3])(props),
    },
    tab: {
      fontWeight: '700',
      [borderProp]: '2px solid',
      borderColor: 'transparent',
      [marginProp]: '-2px',
      color: mode(colors.light.text.tertiary, colors.dark.text.tertiary)(props),
      bg: $bg.reference,
      _selected: {
        [borderProp]: '3px solid',
        borderColor: 'currentColor',
        [marginProp]: '-3px',
        color: $fg.reference,
        [$fg.variable]: colors.light.button[colorScheme].default,
        _dark: {
          [$fg.variable]: colors.dark.button[colorScheme].default,
        },
        _disabled: {
          ...disabled,
        },
      },
      _active: {
        [$bg.variable]: 'none',
        _dark: {
          [$bg.variable]: 'none',
        },
      },
      _disabled: {
        ...disabled,
      },
    },
  };
});

const variantOutline = definePartsStyle((props) => {
  const colorScheme = props.colorScheme as ColorScheme;

  const disabled = {
    fontWeight: '400',
    [$fg.variable]: colors.light.text.disabled,
    [$bg.variable]: colors.light.layer[4].default,
    _dark: {
      [$fg.variable]: colors.dark.text.disabled,
      [$bg.variable]: colors.dark.layer[4].default,
    },
    _selected: {},
    _active: {},
  };

  return {
    tablist: {
      border: `1px solid ${mode(colors.light.border[4], colors.dark.border[4])(props)}`,
      borderRadius: sizes['2'],
      overflow: 'hidden',
    },
    tab: {
      fontWeight: '400',
      [$fg.variable]: colors.light.text.tertiary,
      [$bg.variable]: colors.light.layer[4].default,
      _dark: {
        [$fg.variable]: colors.dark.text.tertiary,
        [$bg.variable]: colors.dark.layer[4].default,
      },
      _selected: {
        fontWeight: '700',
        [$fg.variable]: colors.light.text.on.color.primary,
        [$bg.variable]: colors.light.button[colorScheme].default,
        _dark: {
          [$fg.variable]: colors.dark.text.on.color.primary,
          [$bg.variable]: colors.dark.button[colorScheme].default,
        },
        _disabled: {
          ...disabled,
        },
      },
      _active: {},
      _disabled: {
        ...disabled,
      },
      color: $fg.reference,
      bg: $bg.reference,
    },
  };
});

const variantSolid = definePartsStyle((props) => {
  const colorScheme = props.colorScheme as ColorScheme;

  const disabled = {
    [$fg.variable]: colors.light.text.disabled,
    [$bg.variable]: 'none',
    _dark: {
      [$fg.variable]: colors.dark.text.disabled,
      [$bg.variable]: 'none',
    },
  };

  return {
    tab: {
      borderRadius: 'full',
      fontWeight: '700',
      [$fg.variable]: colors.light.text.primary,
      _dark: {
        [$fg.variable]: colors.dark.text.primary,
      },
      _selected: {
        [$fg.variable]: colors.light.text.on.color.primary,
        [$bg.variable]: colors.light.button[colorScheme].default,
        _dark: {
          [$fg.variable]: colors.dark.text.on.color.primary,
          [$bg.variable]: colors.dark.button[colorScheme].default,
        },
        _disabled: {
          ...disabled,
        },
      },
      _disabled: {
        ...disabled,
      },
      color: $fg.reference,
      bg: $bg.reference,
    },
  };
});

const variants = {
  line: variantLine,
  outline: variantOutline,
  solid: variantSolid,
};

export const theme = defineMultiStyleConfig({
  baseStyle,
  // Uses button sizing.
  sizes: {
    sm: definePartsStyle({
      tablist: {
        h: BUTTON_STYLES['sm'].h,
      },
      tab: {
        ...BUTTON_STYLES['sm'],
        py: 0,
        px: sizes['4'],
      },
    }),
    md: definePartsStyle({
      tablist: {
        h: BUTTON_STYLES['md'].h,
      },
      tab: {
        ...BUTTON_STYLES['md'],
        py: 0,
        px: sizes['4'],
      },
    }),
    lg: definePartsStyle({
      tablist: {
        h: BUTTON_STYLES['lg'].h,
      },
      tab: {
        ...BUTTON_STYLES['lg'],
        py: 0,
        px: sizes['4'],
      },
    }),
    xl: definePartsStyle({
      tablist: {
        h: BUTTON_STYLES['xl'].h,
      },
      tab: {
        ...BUTTON_STYLES['xl'],
        py: 0,
        px: sizes['4'],
      },
    }),
    '2xl': definePartsStyle({
      tablist: {
        h: BUTTON_STYLES['2xl'].h,
      },
      tab: {
        ...BUTTON_STYLES['2xl'],
        py: 0,
        px: sizes['4'],
      },
    }),
  },
  variants,
  defaultProps: {
    size: 'md',
    variant: 'line',
    colorScheme: 'primary',
  },
});
