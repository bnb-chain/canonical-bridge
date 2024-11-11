import { Box, Flex, FlexProps, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import React from 'react';

import { IconImage } from '@/core/components/IconImage';
import { InfoTooltip } from '@/core/components/InfoTooltip';

interface ListItemProps extends FlexProps {
  isActive?: boolean;
  isDisabled?: boolean;
  iconUrl?: string;
  showTag?: boolean;
  incompatibleTooltip?: string;
}

export const ListItem = React.forwardRef((props: ListItemProps, ref: any) => {
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
    <Box ref={ref} p="0 20px 8px">
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
            className="bccb-widget-select-list-item-tag"
            alignItems="center"
            flexShrink={0}
            fontSize={'12px'}
            gap="4px"
            color={theme.colors[colorMode].support.warning[3]}
          >
            <InfoTooltip
              label={incompatibleTooltip}
              placement={'top'}
              minW={'280px'}
              maxW={'280px'}
              iconProps={{
                mt: '1px',
                boxSize: '16px',
              }}
            />
            {formatMessage({ id: 'select-modal.tag.incompatible' })}
          </Flex>
        )}
      </Flex>
    </Box>
  );
});

ListItem.displayName = 'ListItem';
