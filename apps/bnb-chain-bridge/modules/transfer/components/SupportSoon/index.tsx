import { Flex, theme, Typography, useColorMode, useIntl } from '@bnb-chain/space';

import { InfoIcon } from '@/core/components/icons/InfoIcon';

export const SupportSoon = () => {
  const { formatMessage } = useIntl();
  const { colorMode } = useColorMode();
  return (
    <Flex
      mt={theme.sizes['4']}
      flexDir={'row'}
      flexWrap={'nowrap'}
      gap={theme.sizes['2']}
      alignItems={'center'}
      flex={1}
      justifyContent={'center'}
    >
      <InfoIcon w={theme.sizes['6']} h={theme.sizes['6']} />
      <Typography size={'sm'} variant="body" color={theme.colors[colorMode].text.tertiary}>
        {formatMessage({ id: 'support.stargate.soon' })}
      </Typography>
    </Flex>
  );
};
