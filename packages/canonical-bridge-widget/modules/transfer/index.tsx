import { Box, Flex, useColorMode, useIntl } from '@bnb-chain/space';

import { TransferOverview } from '@/modules/transfer/components/TransferOverview';
import { TransferButtonGroup } from '@/modules/transfer/components/TransferButtonGroup';
import { useDefaultSelectedInfo } from '@/modules/transfer/hooks/useDefaultSelectedInfo';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { SendInput } from '@/modules/transfer/components/SendInput';
import { NetWorkSection } from '@/modules/transfer/components/NetWorkSection';

export function TransferPage() {
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();
  const theme = useAppSelector((state) => state.theme.themeConfig);

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
        <Box
          as="h1"
          mb={'8px'}
          fontSize={'20px'}
          fontWeight={500}
          textAlign={'center'}
          borderBottom={`1px solid ${theme.colors[colorMode].border[2]}`}
          pb={'24px'}
        >
          {formatMessage({ id: 'main.title' })}
        </Box>
        <NetWorkSection />
        <SendInput />
        <Flex flexDir="column">
          <TransferButtonGroup />
        </Flex>
      </Flex>
      <TransferOverview />
    </Flex>
  );
}
