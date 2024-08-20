export const typography = {
  letterSpacings: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Multiples of 4 up to 20px with some exceptions, multiples of 8 beyond with no exceptions.
  fontSizes: {
    '2': '0.5rem',
    '3': '0.75rem',
    '3.5': '0.875rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '7': '1.75rem', // 28 is an exception for typography line height.
    '8': '2rem',
    '10': '2.5rem',
    '12': '3rem', // 48
    '14': '3.5rem', // 56
    '16': '4rem', // 64
    '18': '4.5rem', // 72
    '20': '5rem', // 80
    '22': '5.5rem', // 88
  },

  fontWeights: {
    '100': 100,
    '200': 200,
    '300': 300,
    '400': 400,
    '500': 500,
    '600': 600,
    '700': 700,
    '800': 800,
    '900': 900,
  },

  fonts: {
    body: `'Space Grotesk', -apple-system, '.SFNSText-Regular', 'San Francisco', BlinkMacSystemFont,
    '.PingFang-SC-Regular', 'Microsoft YaHei', 'Segoe UI', 'Helvetica Neue', Helvetica, Arial,
    sans-serif`,
    heading: `'Space Grotesk', -apple-system, '.SFNSText-Regular', 'San Francisco', BlinkMacSystemFont,
    '.PingFang-SC-Regular', 'Microsoft YaHei', 'Segoe UI', 'Helvetica Neue', Helvetica, Arial,
    sans-serif`,
    mono: `'Space Grotesk', -apple-system, '.SFNSText-Regular', 'San Francisco', BlinkMacSystemFont,
    '.PingFang-SC-Regular', 'Microsoft YaHei', 'Segoe UI', 'Helvetica Neue', Helvetica, Arial,
    sans-serif`,
  },
};
