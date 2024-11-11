import { MenuItemProps, MenuItem, useTheme, useColorMode } from '@bnb-chain/space';

interface DropdownItemProps extends MenuItemProps {}

export function DropdownItem(props: DropdownItemProps) {
  const { ...restProps } = props;

  const theme = useTheme();
  const { colorMode } = useColorMode();

  return (
    <MenuItem
      className="bccb-widget-header-menu-item"
      px="16px"
      h="40px"
      alignItems="center"
      fontSize="14px"
      fontWeight={400}
      lineHeight={'16px'}
      gap="8px"
      transitionDuration="normal"
      _hover={{
        color: theme.colors[colorMode].text.primary,
        bg: theme.colors[colorMode].popover.selected,
      }}
      {...restProps}
    />
  );
}
