import { ModalContent, ModalContentProps, useColorMode, useTheme } from '@bnb-chain/space';

export function SelectModalContent(props: ModalContentProps) {
  const { colorMode } = useColorMode();
  const theme = useTheme();
  return (
    <ModalContent
      background={theme.colors[colorMode].background.modal}
      borderRadius={'36px'}
      p={0}
      h={640}
      overflow="hidden"
      {...props}
    />
  );
}
