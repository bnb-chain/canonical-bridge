import { Flex, Typography, useColorMode, useIntl, useTheme } from '@bnb-chain/space';

import { TransferToIcon } from '@/core/components/icons/TransferToIcon';
import { FromSection } from '@/modules/transfer/components/FromSection';
import { ToSection } from '@/modules/transfer/components/ToSection';

export const NetWorkSection = () => {
  const { formatMessage } = useIntl();
  const { colorMode } = useColorMode();
  const theme = useTheme();

  return (
    <Flex flexDir={'column'} gap={'8px'} mb={{ base: 0, md: theme.sizes['2'] }}>
      <Flex flexDir={'row'} display={{ base: 'none', md: 'flex' }}>
        <Flex alignItems="center" justifyContent={'space-between'} flex={1}>
          <Typography variant="label" size={'md'} color={theme.colors[colorMode].text.placeholder}>
            {formatMessage({ id: 'from.section.title' })}
          </Typography>
        </Flex>
        <Flex
          alignItems="center"
          justifyContent={'space-between'}
          flex={1}
          ml="48px"
          display={{ base: 'none', md: 'flex' }}
        >
          <Typography variant="label" size={'md'} color={theme.colors[colorMode].text.placeholder}>
            {formatMessage({ id: 'to.section.title' })}
          </Typography>
        </Flex>
      </Flex>{' '}
      <Flex
        flexDir={['column', 'column', 'row']}
        justifyContent={'space-between'}
        alignItems={'center'}
        gap={{ base: '8px', md: '12px' }}
        minW={0}
      >
        <FromSection />
        <TransferToIcon
          w={'24px'}
          h={'24px'}
          mb={{ base: '-8px', md: 0 }}
          transform={{ base: 'rotate(90deg)', md: 'none' }}
        />
        <ToSection />
      </Flex>
    </Flex>
  );
};
