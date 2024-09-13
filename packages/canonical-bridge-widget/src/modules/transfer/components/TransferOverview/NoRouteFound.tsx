import { Flex, Typography, theme, useColorMode, useIntl } from '@bnb-chain/space';

import { RouteNotFoundIcon } from '@/core/components/icons/RouteNotFoundIcon';

export const NoRouteFound = () => {
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();

  return (
    <Flex
      flexDir={'column'}
      w={'100%'}
      gap={'8px'}
      background={theme.colors[colorMode].layer[3].default}
      borderRadius={'16px'}
      p={'16px'}
    >
      <Flex justifyContent={'center'}>
        <RouteNotFoundIcon w={'40px'} h={'40px'} />
      </Flex>
      <Typography variant="body" size={'md'} textAlign={'center'} fontWeight={500} mx={'24px'}>
        {formatMessage({ id: 'route.no-found.title' })}
      </Typography>

      <Typography
        variant="body"
        size={'sm'}
        textAlign={'center'}
        mx={'24px'}
        color={theme.colors[colorMode].text.secondary}
      >
        {formatMessage({ id: 'route.no-found.desc' })}
      </Typography>
    </Flex>
  );
};
