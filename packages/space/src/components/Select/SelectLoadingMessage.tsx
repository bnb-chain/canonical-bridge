import { Flex, useColorMode } from '@chakra-ui/react';

import { theme } from '../../modules/theme';
import { Spinner } from '../Spinner';

export const SelectLoadingMessage = () => {
  const { colorMode } = useColorMode();

  return (
    <Flex
      mx={theme.sizes['4']}
      h={theme.sizes['10']}
      color={theme.colors[colorMode].text.tertiary}
      alignItems="center"
      justifyContent="center"
    >
      <Spinner fontSize={theme.sizes['6']} />
    </Flex>
  );
};
