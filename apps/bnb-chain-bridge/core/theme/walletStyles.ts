import { BoxProps, ColorMode, theme } from '@bnb-chain/space';

export function walletStyles(colorMode: ColorMode) {
  return {
    '.wk-modal': {
      '--wk-radii-modal': theme.sizes['5'],
    },
    '.wk-modal-content': {
      width: { base: '100%', md: '435px' },
      padding: '34px 40px 40px',
    },
    '.wk-modal-header': {
      fontWeight: 700,
      lineHeight: theme.sizes['8'],
    },
    '.wk-modal-body': {
      marginTop: theme.sizes['6'],
      gap: theme.sizes['3'],
    },
    '.wk-modal-footer': {
      marginTop: theme.sizes['6'],
    },
    '[data-layout="list"]': {
      '.wk-wallet-option': {
        height: theme.sizes['16'],
        border: `1px solid ${theme.colors.light.border[3]}`,
        fontSize: theme.sizes['4'],
        lineHeight: 1.5,
        fontWeight: 500,
        bg: 'transparent',
        _hover: {
          bg: theme.colors.light.layer[3].hover,
        },
      },
      '.wk-wallet-option-logo': {
        width: '44px',
        height: '44px',
      },
    },
    '.wk-nowallet-link': {
      fontWeight: 500,
      lineHeight: 1.5,
      fontSize: theme.sizes['4'],
    },
  } as BoxProps['sx'];
}
