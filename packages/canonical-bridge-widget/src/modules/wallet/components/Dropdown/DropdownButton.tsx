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
    },
    normal: {
      default: theme.colors[colorMode].button.select.border,
      hover: theme.colors[colorMode].button.select.hover,
    },
  };

  const colors = isWarning ? colorMap.warning : colorMap.normal;

  return (
    <MenuButton
      h={'40px'}
      minW={'40px'}
      pl="12px"
      pr="16px"
      lineHeight="16px"
      outline={isActive ? '2px solid' : '1px solid'}
      outlineColor={colors.default}
      bg={isActive ? theme.colors[colorMode].button.select.background.hover : undefined}
      borderRadius={'100px'}
      fontWeight={500}
      transitionDuration="normal"
      justifyContent="center"
      border="none"
      _hover={{
        outlineWidth: 2,
        outlineColor: colors.hover,
        bg: theme.colors[colorMode].button.select.background.hover,
      }}
      {...restProps}
    >
      <Flex alignItems="center" gap="8px" justifyContent="center">
        {children}
      </Flex>
    </MenuButton>
  );
}
