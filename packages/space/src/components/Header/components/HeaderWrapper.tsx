import { useColorMode, Box, BoxProps } from '@chakra-ui/react';

import { theme } from '../../../modules/theme';

export const HeaderWrapper = ({ children, ...otherProps }: BoxProps) => {
  const { colorMode } = useColorMode();

  return (
    <Box
      as={'header'}
      height={{
        base: theme.sizes['16'],
        md: theme.sizes['20'],
        lg: theme.sizes['20'],
      }}
      bg={theme.colors[colorMode].background['1']}
      px={{
        base: theme.sizes['5'],
        md: theme.sizes['10'],
        lg: theme.sizes['16'],
      }}
      display={'flex'}
      justifyContent="space-between"
      w="100%"
      alignItems="center"
      position={'relative'}
      zIndex={theme.zIndices.dropdown}
      {...otherProps}
    >
      {children}
    </Box>
  );
};
