import { Flex, theme, Typography, useColorMode, useIntl } from '@bnb-chain/space';

import { InfoIcon } from '@/core/components/icons/InfoIcon';

export const SupportSoon = () => {
  const { formatMessage } = useIntl();
  const { colorMode } = useColorMode();
  return (
    <Flex
      mt={'16px'}
      flexDir={'row'}
      flexWrap={'nowrap'}
      gap={'8px'}
      alignItems={'center'}
      flex={1}
      justifyContent={'center'}
    >
      <InfoIcon w={'24px'} h={'24px'} />
      <Typography size={'sm'} variant="body" color={theme.colors[colorMode].text.tertiary}>
        {formatMessage({ id: 'support.stargate.soon' })}
      </Typography>
    </Flex>
  );
};
