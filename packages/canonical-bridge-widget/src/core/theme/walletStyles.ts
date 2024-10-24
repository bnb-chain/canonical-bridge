import { BoxProps, ColorMode, theme } from '@bnb-chain/space';

export function walletStyles(colorMode: ColorMode) {
  return {
    '.wk-modal': {
      '--wk-radii-modal': '20px',
    },
    '.wk-modal-content': {
      width: { base: '100%', md: '435px' },
      padding: { base: undefined, md: '34px 40px 40px' },
    },
    '.wk-modal-header': {
      fontWeight: 700,
      lineHeight: '32px',
    },
    '.wk-modal-body': {
      marginTop: '24px',
      gap: '12px',
    },
    '.wk-modal-footer': {
      marginTop: '24px',
    },
    '[data-layout="list"]': {
      '.wk-wallet-option': {
        height: '64px',
        border: `1px solid ${theme.colors.light.border[3]}`,
        fontSize: '16px',
        borderRadius: '8px',
        pl: '20px',
        pr: '12px',
        w: '100%',
        lineHeight: 1.5,
        fontWeight: 500,
        bg: 'transparent',
        alignItems: 'center',
        justifyContent: 'space-between',
        transitionProperty: 'background-color',
        transitionDuration: '0.3s',
        cursor: 'pointer',
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
      fontSize: '16px',
    },
  } as BoxProps['sx'];
}
