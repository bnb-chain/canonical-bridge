import { ChakraBaseProvider, ColorModeScript, Flex, useColorMode } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { IntlProvider } from 'react-intl';

import * as messages from '../src/locales';
import { theme } from '../src/modules/theme';

// https://github.com/chakra-ui/chakra-ui/issues/6855
// Dark mode is broken in Chakra UI Storybook.
// Create custom toggle referenced from the issue above.
interface ColorModeProps {
  colorMode: 'light' | 'dark';
  children: JSX.Element;
}

const ColorMode = (props: ColorModeProps) => {
  const { setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode(props.colorMode);
  }, [props.colorMode]);

  return props.children;
};

export const globalTypes = {
  colorMode: {
    defaultValue: 'light',
    toolbar: {
      title: '⭐',
      items: [
        { title: 'Light', value: 'light' },
        { title: 'Dark', value: 'dark' },
      ],
    },
  },
};

export const decorators = [
  (Story, context) => (
    <IntlProvider locale="en" messages={messages['en']}>
      <ChakraBaseProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ColorMode colorMode={context.globals.colorMode}>
          <Flex flex="1" flexDirection="column" margin={theme.sizes['4']}>
            <Story />
          </Flex>
        </ColorMode>
      </ChakraBaseProvider>
    </IntlProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  layout: 'fullscreen',
  previewTabs: {
    'storybook/docs/panel': {
      hidden: true,
    },
  },
  chakra: {
    theme,
  },
};
