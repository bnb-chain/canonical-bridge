import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Meta } from '@storybook/react';

import { Button } from '../Button';

export default {
  title: 'Components/Atoms/Modal',
} as Meta;

export const Default = () => {
  return (
    <Modal isCentered isOpen onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Modal body.</ModalBody>

        <ModalFooter>
          <Button>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
