import { extendBaseTheme, Theme } from '@chakra-ui/react';

import { foundations, FoundationsType } from './foundations';
import { components } from './components';

const extensions: {
  components: typeof components;
} & FoundationsType = {
  components,
  ...foundations,
};
type ThemeType = Omit<Theme, keyof typeof extensions> & typeof extensions;

export const theme = extendBaseTheme(extensions) as ThemeType;
