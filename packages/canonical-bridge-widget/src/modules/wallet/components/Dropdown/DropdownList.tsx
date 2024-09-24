import { MenuList, MenuListProps, useColorMode, useTheme } from '@bnb-chain/space';

interface DropdownListProps extends MenuListProps {}

export function DropdownList(props: DropdownListProps) {
  const { ...restProps } = props;

  const theme = useTheme();
  const { colorMode } = useColorMode();

  return (
    <MenuList
      bg={theme.colors[colorMode].popover.background}
      borderRadius={'8px'}
      maxH={'400px'}
      w="240px"
      overflowY="auto"
      sx={{
        '::-webkit-scrollbar': {
          display: 'none',
        },
      }}
      boxShadow={theme.colors[colorMode].popover.shadow}
      {...restProps}
    />
  );
}
