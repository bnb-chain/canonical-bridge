import { ModalContent, ModalContentProps, useColorMode } from '@bnb-chain/space';

import { useAppSelector } from '@/modules/store/StoreProvider';

export function SelectModalContent(props: ModalContentProps) {
  const { colorMode } = useColorMode();
  const theme = useAppSelector((state) => state.theme.themeConfig);
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
