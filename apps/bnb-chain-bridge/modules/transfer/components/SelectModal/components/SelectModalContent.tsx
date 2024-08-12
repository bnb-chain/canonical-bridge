import { ModalContent, ModalContentProps, theme, useColorMode } from '@bnb-chain/space';

export function SelectModalContent(props: ModalContentProps) {
  const { colorMode } = useColorMode();
  return (
    <ModalContent
      background={theme.colors[colorMode].background['2']}
      borderRadius={theme.sizes['6']}
      p={0}
      h={640}
      overflow="hidden"
      {...props}
    />
  );
}
