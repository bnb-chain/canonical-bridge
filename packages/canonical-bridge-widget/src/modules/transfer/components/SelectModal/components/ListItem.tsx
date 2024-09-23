import { Box, Flex, FlexProps, Tooltip, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { InfoCircleIcon } from '@bnb-chain/icons';

import { IconImage } from '@/core/components/IconImage';

interface ListItemProps extends FlexProps {
  isActive?: boolean;
  isDisabled?: boolean;
  iconUrl?: string;
  showTag?: boolean;
  incompatibleTooltip?: string;
}

export function ListItem(props: ListItemProps) {
  const {
    isActive = false,
    isDisabled = false,
    iconUrl,
    showTag = true,
    children,
    onClick,
    incompatibleTooltip,

    _hover,
    ...restProps
  } = props;

  const { colorMode } = useColorMode();
  const theme = useTheme();
  const { formatMessage } = useIntl();

  return (
    <Box p="0 20px 8px">
      <Flex
        borderRadius={'8px'}
        px={'12px'}
        py="8px"
        h="56px"
        alignItems="center"
        border="1px solid"
        borderColor={isActive ? theme.colors[colorMode].border.brand : 'transparent'}
        bg={isActive ? 'rgba(255, 233, 0, 0.06)' : 'transparent'}
        cursor={isDisabled ? 'inherit' : 'pointer'}
        transitionDuration="normal"
        _hover={{
          ..._hover,
          bg: !isActive && !isDisabled ? theme.colors[colorMode].layer['3'].hover : undefined,
        }}
        gap={'12px'}
        fontSize="14px"
        lineHeight="16px"
        fontWeight={500}
        onClick={isDisabled ? undefined : onClick}
        {...restProps}
      >
        <IconImage
          src={iconUrl}
          filter={isDisabled ? 'grayscale(100%)' : undefined}
          opacity={isDisabled ? 0.5 : 1}
          flexShrink={0}
        />
        <Flex w={'100%'} overflow="hidden" opacity={isDisabled ? 0.5 : 1}>
          {children}
        </Flex>
        {showTag && isDisabled && (
          <Flex
            alignItems="center"
            flexShrink={0}
            fontSize={'12px'}
            gap="4px"
            color={theme.colors[colorMode].support.warning[3]}
          >
            <Tooltip hasArrow label={incompatibleTooltip} placement={'top'} maxW={'280px'}>
              <InfoCircleIcon mt={'1px'} boxSize={'16px'} />
            </Tooltip>
            {formatMessage({ id: 'select-modal.tag.incompatible' })}
          </Flex>
        )}
      </Flex>
    </Box>
  );
}
