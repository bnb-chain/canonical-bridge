import { Flex, Typography, useColorMode, useIntl, useTheme } from '@bnb-chain/space';

import { TransferToIcon } from '@/core/components/icons/TransferToIcon';
import { FromSection } from '@/modules/transfer/components/FromSection';
import { ToSection } from '@/modules/transfer/components/ToSection';

export const NetWorkSection = () => {
  const { formatMessage } = useIntl();
  const { colorMode } = useColorMode();
  const theme = useTheme();

  return (
    <Flex flexDir={'column'} gap={'12px'}>
      <Flex flexDir={'row'} display={{ base: 'none', md: 'flex' }}>
        <Flex alignItems="center" justifyContent={'space-between'} flex={1}>
          <Typography
            variant="body"
            size={'sm'}
            lineHeight={'16px'}
            color={theme.colors[colorMode].text.placeholder}
          >
            {formatMessage({ id: 'from.section.title' })}
          </Typography>
        </Flex>
        <Flex
          alignItems="center"
          justifyContent={'space-between'}
          flex={1}
          ml="49px"
          display={{ base: 'none', md: 'flex' }}
        >
          <Typography
            variant="body"
            lineHeight={'16px'}
            size={'sm'}
            color={theme.colors[colorMode].text.placeholder}
          >
            {formatMessage({ id: 'to.section.title' })}
          </Typography>
        </Flex>
      </Flex>{' '}
      <Flex
        flexDir={['column', 'column', 'row']}
        justifyContent={'space-between'}
        alignItems={'center'}
        gap={['16px', '16px', '16px', '12px']}
        minW={0}
      >
        <FromSection />
        <TransferToIcon w={'24px'} h={'24px'} transform={{ base: 'rotate(90deg)', md: 'none' }} />
        <ToSection />
      </Flex>
    </Flex>
  );
};
