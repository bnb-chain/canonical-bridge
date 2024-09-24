import { MenuItemProps, MenuItem } from '@bnb-chain/space';

interface DropdownItemProps extends MenuItemProps {}

export function DropdownItem(props: DropdownItemProps) {
  const { ...restProps } = props;

  return (
    <MenuItem
      px="16px"
      h="40px"
      alignItems="center"
      fontSize="14px"
      fontWeight={400}
      lineHeight={'16px'}
      gap="8px"
      {...restProps}
    />
  );
}
