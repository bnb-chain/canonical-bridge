import { rgba } from '@node-real/uikit';

export const light = {
  colors: {
    readable: {
      normal: '#1E2026',
      secondary: '#76808F',
      disabled: '#AEB4BC',
      border: '#E6E8EA',
      border_secondary: '#f1f1f1',
      white: '#FFFFFF',
      top: {
        secondary: '#474D57',
      },
    },

    bg: {
      title: '#F5F5F5',
      title_60: 'rgba(245, 245, 245, 0.6)',
      bottom: '#F5F5F5',
      bottom_secondary: '#FFFFFF',
      middle: '#FFFFFF',
      codebox: '#F0F4F9',
      top: {
        normal: '#F5F5F5',
        active: '#E6E8EA',
      },
    },

    scene: {
      primary: {
        normal: '#F0B90B',
        active: '#F8D12F',
        opacity: rgba('#F0B90B', 0.1),
      },

      success: {
        normal: '#02C076',
        active: '#2ED191',
        opacity: rgba('#2ED191', 0.1),
      },

      danger: {
        normal: '#D9304E',
        active: '#FC6E75',
        opacity: rgba('#FC6E75', 0.1),
      },

      warning: {
        normal: '#EB9E09',
        active: '#F5B631',
        opacity: rgba('#F5B631', 0.1),
      },
    },
  },

  shadows: {
    normal: '0px 4px 24px rgba(0, 0, 0, 0.08)',
  },
};
