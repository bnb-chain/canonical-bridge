import { ModalBody, ModalBodyProps } from '@bnb-chain/space';

export function SelectModalBody(props: ModalBodyProps) {
  return (
    <ModalBody
      p={{ base: '20px', md: '20px' }}
      pb={{ base: 0, md: 0 }}
      fontSize={'14px'}
      lineHeight={'16px'}
      fontWeight={500}
      flex={1}
      h="0px"
      display="flex"
      flexDir="column"
      {...props}
    />
  );
}
