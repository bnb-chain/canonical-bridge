module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    // '@chakra-ui/storybook-addon',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-storysource',
  ],
  // https://github.com/chakra-ui/chakra-ui/issues/6433
  core: {
    builder: 'webpack5',
  },
  features: {
    emotionAlias: false,
  },
  refs: {
    '@chakra-ui/react': { disable: true },
  },
  // Temporary to fix build error after upgrading to TypeScript v5.
  // https://github.com/hipstersmoothie/react-docgen-typescript-plugin/issues/78
  typescript: {
    reactDocgen: 'react-docgen-typescript-plugin',
  },
  previewHead: (head) => `
    ${head}
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Space+Grotesk:300,400,500,600,700"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Zen+Dots"
    />
  `,
};
