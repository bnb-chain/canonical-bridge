import { Box, useColorMode, useTheme } from '@bnb-chain/space';

export const RouteMask = () => {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  return (
    <Box
      zIndex={0}
      position={'absolute'}
      w={'100%'}
      h={'100%'}
      background={theme.colors[colorMode].modal.item.background.default}
      opacity={'0.5'}
      top={0}
      left={0}
      borderRadius={'8px'}
    />
  );
};
