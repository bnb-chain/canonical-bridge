import { Flex, MenuButton, MenuButtonProps, useColorMode, useTheme } from '@bnb-chain/space';

export interface DropdownButtonProps extends MenuButtonProps {
  isActive?: boolean;
  isWarning?: boolean;
}

export function DropdownButton(props: DropdownButtonProps) {
  const { children, isActive = false, isWarning = false, ...restProps } = props;

  const theme = useTheme();
  const { colorMode } = useColorMode();

  const colorMap = {
    warning: {
      default: theme.colors[colorMode].support.warning['3'],
      hover: theme.colors[colorMode].support.warning['3'],
      active: theme.colors[colorMode].support.warning['3'],
    },
    normal: {
      default: theme.colors[colorMode].input.border.default,
      hover: theme.colors[colorMode].input.border.hover,
      active: theme.colors[colorMode].input.border.active,
    },
  };

  const colors = isWarning ? colorMap.warning : colorMap.normal;

  return (
    <MenuButton
      className="bccb-widget-header-menu-button"
      h={'40px'}
      minW={'40px'}
      pl="12px"
      pr="16px"
      lineHeight="16px"
      outline={isActive ? '2px solid' : '1px solid'}
      outlineColor={isActive ? colors.active : colors.default}
      bg={isActive ? theme.colors[colorMode].button.select.background.hover : undefined}
      borderRadius={'100px'}
      fontWeight={500}
      transitionDuration="normal"
      justifyContent="center"
      border="none"
      _hover={{
        outlineWidth: 2,
        outlineColor: isActive ? colors.active : colors.hover,
      }}
      {...restProps}
    >
      <Flex alignItems="center" gap="8px" justifyContent="center">
        {children}
      </Flex>
    </MenuButton>
  );
}
