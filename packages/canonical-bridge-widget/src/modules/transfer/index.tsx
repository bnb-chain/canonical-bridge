import { Box, Flex, useColorMode, useIntl, useTheme } from '@bnb-chain/space';

import { FromSection } from '@/modules/transfer/components/FromSection';
import { ToSection } from '@/modules/transfer/components/ToSection';
import { TransferOverview } from '@/modules/transfer/components/TransferOverview';
import { TransferButtonGroup } from '@/modules/transfer/components/TransferButtonGroup';
import { useDefaultSelectedInfo } from '@/modules/transfer/hooks/useDefaultSelectedInfo';
import { ExchangeChain } from '@/modules/transfer/components/Button/ExchangeChain';

export function TransferPage() {
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();
  const theme = useTheme();

  useDefaultSelectedInfo();

  return (
    <Flex flexDir="row" mb={'160px'} alignItems={'flex-start'}>
      <Flex
        flexDir="column"
        background={theme.colors[colorMode].background.main}
        color={theme.colors[colorMode].text.primary}
        boxShadow={`0 ${'24px'} ${'64px'} 0 rgba(0, 0, 0, 0.48)`}
        borderRadius={'24px'}
        px={'24px'}
        py={'32px'}
        w={'588px'}
        gap={'24px'}
        position="relative"
      >
        <Box as="h1" mb={'8px'} fontSize={'20px'} fontWeight={500}>
          {formatMessage({ id: 'main.title' })}
        </Box>
        <FromSection />
        <ExchangeChain />
        <ToSection />
        <Flex flexDir="column">
          <TransferButtonGroup />
        </Flex>
      </Flex>
      <TransferOverview />
    </Flex>
  );
}
