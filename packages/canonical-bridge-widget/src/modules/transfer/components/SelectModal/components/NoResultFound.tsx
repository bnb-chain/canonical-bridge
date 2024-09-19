import { Box, Flex, FlexProps, Text, theme, useColorMode, useIntl } from '@bnb-chain/space';

import { NoResultIcon } from '@/core/components/icons/NoResultIcon';

interface NoResultFoundProps extends FlexProps {}

export function NoResultFound(props: NoResultFoundProps) {
  const { ...restProps } = props;
  const { formatMessage } = useIntl();

  const { colorMode } = useColorMode();

  return (
    <Flex alignItems="center" flexDir="column" maxW={347} margin="0 auto" {...restProps}>
      <NoResultIcon />
      <Box fontWeight={700} fontSize={'20px'} lineHeight={1.4} mt={'16px'} mb={'8px'}>
        {formatMessage({ id: 'select-modal.select.no-result.title' })}
      </Box>
      <Text textAlign="center" lineHeight={'20px'} color={theme.colors[colorMode].text.secondary}>
        {formatMessage({ id: 'select-modal.select.no-result.warning' })}
      </Text>
    </Flex>
  );
}
