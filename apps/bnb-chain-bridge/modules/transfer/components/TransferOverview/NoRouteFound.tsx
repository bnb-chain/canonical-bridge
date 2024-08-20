import { Flex, Typography, theme, useColorMode, useIntl } from '@bnb-chain/space';

import { RouteNotFoundIcon } from '@/core/components/icons/RouteNotFoundIcon';

export const NoRouteFound = () => {
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();

  return (
    <Flex
      flexDir={'column'}
      w={'100%'}
      gap={theme.sizes['2']}
      background={theme.colors[colorMode].layer[3].default}
      borderRadius={theme.sizes['4']}
      p={theme.sizes['4']}
    >
      <Flex justifyContent={'center'}>
        <RouteNotFoundIcon w={theme.sizes['10']} h={theme.sizes['10']} />
      </Flex>
      <Typography
        variant="body"
        size={'md'}
        textAlign={'center'}
        fontWeight={500}
        mx={theme.sizes['6']}
      >
        {formatMessage({ id: 'route.no-found.title' })}
      </Typography>

      <Typography
        variant="body"
        size={'sm'}
        textAlign={'center'}
        mx={theme.sizes['6']}
        color={theme.colors[colorMode].text.secondary}
      >
        {formatMessage({ id: 'route.no-found.desc' })}
      </Typography>
    </Flex>
  );
};
