import { ColorMode, ColorModeContext, ColorModeContextType, useColorMode } from '@chakra-ui/react';
import { useMemo } from 'react';

const noop = () => {};

/**
 * This provider is used to wrap components designed to look inverse according to our design system, such as `Modal`.
 * It follows the same pattern as `LightMode` and `DarkMode`.
 */
export const InverseMode = (props: React.PropsWithChildren<{}>) => {
  const { colorMode } = useColorMode();

  const context = useMemo<ColorModeContextType>(
    () => ({
      colorMode: colorMode === 'light' ? 'dark' : 'light',
      toggleColorMode: noop,
      setColorMode: noop,
      forced: true,
    }),
    [colorMode],
  );

  return <ColorModeContext.Provider value={context} {...props} />;
};

export const useInverseColorMode = () => {
  const { colorMode } = useColorMode();

  return useMemo((): { colorMode: ColorMode } => {
    return { colorMode: colorMode === 'light' ? 'dark' : 'light' };
  }, [colorMode]);
};
