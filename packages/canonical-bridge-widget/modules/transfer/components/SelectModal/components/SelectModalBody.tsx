import { ModalBody, ModalBodyProps, theme } from '@bnb-chain/space';

export function SelectModalBody(props: ModalBodyProps) {
  return (
    <ModalBody
      p={{ base: theme.sizes['5'], md: theme.sizes['5'] }}
      pb={{ base: 0, md: 0 }}
      fontSize={theme.sizes['3.5']}
      lineHeight={theme.sizes['4']}
      fontWeight={theme.fontWeights[500]}
      flex={1}
      h="0px"
      display="flex"
      flexDir="column"
      {...props}
    />
  );
}
