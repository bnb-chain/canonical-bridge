import { Flex, useColorMode } from '@chakra-ui/react';
import { useIntl } from 'react-intl';

import { theme } from '../../modules/theme';
import { TYPOGRAPHY_STYLES } from '../Typography';

export const SelectNoOptionsMessage = () => {
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();

  return (
    <Flex
      {...TYPOGRAPHY_STYLES['body']['sm']}
      mx={theme.sizes['4']}
      h={theme.sizes['10']}
      color={theme.colors[colorMode].text.tertiary}
      alignItems="center"
    >
      {formatMessage({ id: 'component.select.message-no-options' })}
    </Flex>
  );
};
