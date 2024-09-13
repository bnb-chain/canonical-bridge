import { Flex, Typography, useBreakpointValue, useColorMode, useIntl } from '@bnb-chain/space';

import { TransferToIcon } from '@/core/components/icons/TransferToIcon';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { FromSection } from '@/modules/transfer/components/FromSection';
import { ToSection } from '@/modules/transfer/components/ToSection';

export const NetWorkSection = () => {
  const { formatMessage } = useIntl();
  const { colorMode } = useColorMode();
  const theme = useAppSelector((state) => state.theme.themeConfig);
  const isBase = useBreakpointValue({ base: true, md: false }) ?? false;

  return (
    <Flex flexDir={'column'} gap={'12px'}>
      {!isBase ? (
        <>
          <Flex flexDir={'row'}>
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
            <Flex alignItems="center" justifyContent={'space-between'} flex={1} ml="49px">
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
        </>
      ) : null}
      <Flex
        flexDir={['column', 'column', 'row']}
        justifyContent={'space-between'}
        alignItems={'center'}
        gap={'12px'}
      >
        <FromSection />
        <TransferToIcon transform={!isBase ? '' : 'rotate(90deg)'} />
        <ToSection />
      </Flex>
    </Flex>
  );
};
