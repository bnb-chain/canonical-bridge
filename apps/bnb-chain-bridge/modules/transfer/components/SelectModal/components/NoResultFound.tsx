import { Box, Flex, FlexProps, Text, theme, useColorMode } from '@bnb-chain/space';

import { NoResultIcon } from '../../../../../core/components/icons/NoResultIcon';

interface NoResultFoundProps extends FlexProps {}

export function NoResultFound(props: NoResultFoundProps) {
  const { ...restProps } = props;

  const { colorMode } = useColorMode();

  return (
    <Flex alignItems="center" flexDir="column" maxW={347} margin="0 auto" {...restProps}>
      <NoResultIcon />
      <Box
        fontWeight={theme.fontWeights['700']}
        fontSize={theme.sizes['5']}
        lineHeight={1.4}
        mt={theme.sizes['4']}
        mb={theme.sizes['2']}
      >
        No result found
      </Box>
      <Text
        textAlign="center"
        lineHeight={theme.sizes['5']}
        color={theme.colors[colorMode].text.secondary}
      >
        Try adjusting your search request to find what you’re looking for
      </Text>
    </Flex>
  );
}
