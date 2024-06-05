import { Flex, FlexProps } from '@node-real/uikit';

export interface ListItemProps extends FlexProps {}

export function ListItem(props: ListItemProps) {
  return (
    <Flex
      alignItems="center"
      px={20}
      h={63}
      bg="bg.bottom"
      transitionProperty="colors"
      transitionDuration="normal"
      borderRadius={12}
      cursor="pointer"
      _hover={{
        bg: 'bg.top.active',
      }}
      fontWeight={600}
      fontSize={18}
      {...props}
    />
  );
}
