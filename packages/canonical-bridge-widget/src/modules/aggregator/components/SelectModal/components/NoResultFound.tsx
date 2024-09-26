import { Box, Flex, FlexProps, Text, theme, useColorMode, useIntl } from '@bnb-chain/space';

import { NoResultIcon } from '@/core/components/icons/NoResultIcon';

interface NoResultFoundProps extends FlexProps {}

export function NoResultFound(props: NoResultFoundProps) {
  const { ...restProps } = props;
  const { formatMessage } = useIntl();

  const { colorMode } = useColorMode();

  return (
    <Flex alignItems="center" flexDir="column" maxW={347} margin="32px auto" {...restProps}>
      <NoResultIcon />
      <Box fontWeight={700} fontSize={'20px'} lineHeight={1.4} mt={'16px'} mb={'8px'}>
        {formatMessage({ id: 'select-modal.search.no-result.title' })}
      </Box>
      <Text
        textAlign="center"
        fontSize={'14px'}
        lineHeight={'20px'}
        fontWeight={500}
        color={theme.colors[colorMode].text.secondary}
      >
        {formatMessage({ id: 'select-modal.search.no-result.warning' })}
      </Text>
    </Flex>
  );
}
