import { InfoCircleIcon } from '@bnb-chain/icons';
import { Flex, theme, Tooltip, useColorMode } from '@bnb-chain/space';

export interface UnavailableTagProps {
  tips?: React.ReactNode;
}

export function UnavailableTag(props: UnavailableTagProps) {
  const { tips } = props;

  const { colorMode } = useColorMode();

  return (
    <Tooltip label={tips} placement="top" maxW={'280px'}>
      <Flex
        display="inline-flex"
        flexShrink={0}
        fontSize={theme.sizes[3]}
        lineHeight={theme.sizes[4]}
        gap={theme.sizes[1]}
        px={theme.sizes[2]}
        py={theme.sizes[1]}
        color={theme.colors[colorMode].support.warning[1]}
        bg={theme.colors[colorMode].support.warning[5]}
        borderRadius={theme.sizes['10']}
      >
        Unavailable
        <InfoCircleIcon boxSize={theme.sizes['4']} />
      </Flex>
    </Tooltip>
  );
}
