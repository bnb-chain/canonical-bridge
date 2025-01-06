import { Flex, Typography, useColorMode, useIntl, useTheme } from '@bnb-chain/space';

import { FromSection } from '@/modules/transfer/components/FromSection';
import { ToSection } from '@/modules/transfer/components/ToSection';
import { ExchangeChainButton } from '@/modules/transfer/components/Button/ExchangeChainButton';

export const NetWorkSection = () => {
  const { formatMessage } = useIntl();
  const { colorMode } = useColorMode();
  const theme = useTheme();

  return (
    <Flex className="bccb-widget-network" flexDir={'column'} gap={'8px'}>
      <Flex flexDir={'row'} display={{ base: 'none', md: 'flex' }}>
        <Flex
          className="bccb-widget-network-title"
          alignItems="center"
          justifyContent={'space-between'}
          flex={1}
        >
          <Typography
            variant="label"
            size={'md'}
            color={theme.colors[colorMode].text.network.title}
          >
            {formatMessage({ id: 'from.section.title' })}
          </Typography>
        </Flex>
        <Flex
          className="bccb-widget-network-title"
          alignItems="center"
          justifyContent={'space-between'}
          flex={1}
          ml="48px"
          display={{ base: 'none', md: 'flex' }}
        >
          <Typography
            variant="label"
            size={'md'}
            color={theme.colors[colorMode].text.network.title}
          >
            {formatMessage({ id: 'to.section.title' })}
          </Typography>
        </Flex>
      </Flex>{' '}
      <Flex
        className="bccb-widget-network-row"
        flexDir={['column', 'column', 'row']}
        justifyContent={'space-between'}
        alignItems={'center'}
        minW={0}
      >
        <FromSection />
        <ExchangeChainButton />
        <ToSection />
      </Flex>
    </Flex>
  );
};
