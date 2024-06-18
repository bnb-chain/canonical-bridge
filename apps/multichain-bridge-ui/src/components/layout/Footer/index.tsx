import { Flex, FlexProps } from '@node-real/uikit';

export function Footer(props: FlexProps) {
  return (
    <Flex
      as="footer"
      h={64}
      borderTop="1px solid readable.border"
      justifyContent="center"
      alignItems="center"
      {...props}
    >
      © 2024 bnbchain.org. All rights reserved.
    </Flex>
  );
}
