# @bnb-chain/space

This repository holds the source code to the component library used by this project. It uses
[Chakra UI](https://github.com/chakra-ui/chakra-ui) under the hood.

If a component is not specific to a page and it does not rely on business logic, it belongs in this
project.

If a component needs i18n, you can put the translation in [locales/en.ts](./src/locales/en.ts).

## Theme

### Colors

Our color scheme works a bit differently than Chakra UI. We have two themes,
[dark](./src/modules/theme/foundations/colors/dark.ts) and
[light](./src/modules/theme/foundations/colors/light.ts).

Colors come in pairs (i.e. every dark color has a light equivalent) so switching themes is seamless.

```
import { theme, useColorMode } from '@bnb-chain/space';
...
const { colorMode } = useColorMode();
...
console.log(theme.colors[colorMode].text.primary); // #FFFFFF in dark mode, #181A1E in light mode.
```
