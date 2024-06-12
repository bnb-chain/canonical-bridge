import { FlexProps, Flex } from '@node-real/uikit';

export interface TagProps extends FlexProps {}

export function Tag(props: TagProps) {
  const { children, ...restProps } = props;
  return (
    <Flex
      px={4}
      borderRadius={4}
      fontSize={12}
      color="readable.secondary"
      border="1px solid readable.border"
      {...restProps}
    >
      {children}
    </Flex>
  );
}
