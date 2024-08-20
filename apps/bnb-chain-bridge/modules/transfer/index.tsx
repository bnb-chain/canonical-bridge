import { Box, Flex, theme, useColorMode, useIntl } from '@bnb-chain/space';

import { RefreshingButton } from '@/modules/transfer/components/Button/RefreshingButton';
import { FromSection } from '@/modules/transfer/components/FromSection';
import { ExchangeChain } from '@/modules/transfer/components/Button/ExchangeChain';
import { ToSection } from '@/modules/transfer/components/ToSection';
import { TransferOverview } from '@/modules/transfer/components/TransferOverview';
import { TransferButtonGroup } from '@/modules/transfer/components/TransferButtonGroup';
import { useDefaultSelectedInfo } from '@/modules/transfer/hooks/useDefaultSelectedInfo';
import { useAppSelector } from '@/core/store/hooks';
import { SolanaTransferButtonGroup } from '@/modules/transfer/solana/SolanaTransferButtonGroup';

export function TransferPage() {
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();

  useDefaultSelectedInfo();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  return (
    <Flex flexDir="column" mb={theme.sizes['40']}>
      <Flex
        flexDir="column"
        background={theme.colors[colorMode].layer['2'].default}
        color={theme.colors[colorMode].text.primary}
        boxShadow={`0 ${theme.sizes['6']} ${theme.sizes['16']} 0 rgba(0, 0, 0, 0.48)`}
        borderRadius={theme.sizes['6']}
        px={theme.sizes['6']}
        py={theme.sizes['8']}
        w={'588px'}
        position="relative"
      >
        <Box as="h1" fontSize={theme.sizes['5']} fontWeight={500}>
          {formatMessage({ id: 'main.title' })}
        </Box>
        <Box left={`calc(100% + ${theme.sizes['8']})`} top={0} position={'absolute'}>
          <RefreshingButton />
        </Box>
        <FromSection />
        <ExchangeChain />
        <ToSection />
        <TransferOverview />
        <Flex flexDir="column" mt={theme.sizes['10']}>
          {fromChain?.chainType === 'solana' ? (
            <SolanaTransferButtonGroup />
          ) : (
            <TransferButtonGroup />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
