import { LogoIcon } from '@/components/icons/Logo';
import { Flex, FlexProps } from '@node-real/uikit';

export function Header(props: FlexProps) {
  return (
    <Flex
      as="header"
      h={68}
      borderBottom="1px solid readable.border"
      alignItems="center"
      px={24}
      {...props}
    >
      <LogoIcon />
    </Flex>
  );
}
