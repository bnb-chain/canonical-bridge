import { InfoCircleIcon } from '@bnb-chain/icons';
import { Flex, theme, Tooltip, useColorMode, useIntl } from '@bnb-chain/space';

export interface UnavailableTagProps {
  tips?: React.ReactNode;
}

export function UnavailableTag(props: UnavailableTagProps) {
  const { tips } = props;

  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();

  return (
    <Tooltip label={tips} placement="top" maxW={'280px'}>
      <Flex
        display="inline-flex"
        flexShrink={0}
        fontSize={'12px'}
        lineHeight={'16px'}
        gap={'4px'}
        px={'8px'}
        py={'4px'}
        color={theme.colors[colorMode].support.warning[1]}
        bg={theme.colors[colorMode].support.warning[5]}
        borderRadius={'40px'}
      >
        {formatMessage({ id: 'select-modal.select.tag.unavailable' })}
        <InfoCircleIcon boxSize={'16px'} />
      </Flex>
    </Tooltip>
  );
}
