import { Box, Flex, theme, useColorMode, useIntl } from '@bnb-chain/space';

import { FromSection } from '@/modules/transfer/components/FromSection';
import { ExchangeChain } from '@/modules/transfer/components/Button/ExchangeChain';
import { ToSection } from '@/modules/transfer/components/ToSection';
import { TransferOverview } from '@/modules/transfer/components/TransferOverview';
import { TransferButtonGroup } from '@/modules/transfer/components/TransferButtonGroup';
import { useDefaultSelectedInfo } from '@/modules/transfer/hooks/useDefaultSelectedInfo';

export function TransferPage() {
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();

  useDefaultSelectedInfo();

  return (
    <Flex flexDir="row" mb={theme.sizes['40']} alignItems={'flex-start'}>
      <Flex
        flexDir="column"
        background={theme.colors[colorMode].layer['2'].default}
        color={theme.colors[colorMode].text.primary}
        boxShadow={`0 ${theme.sizes['6']} ${theme.sizes['16']} 0 rgba(0, 0, 0, 0.48)`}
        borderRadius={theme.sizes['6']}
        px={theme.sizes['6']}
        py={theme.sizes['8']}
        w={'588px'}
        gap={theme.sizes['4']}
        position="relative"
      >
        <Box as="h1" mb={theme.sizes['2']} fontSize={theme.sizes['5']} fontWeight={500}>
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
