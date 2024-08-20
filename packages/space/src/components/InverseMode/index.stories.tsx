import {
  Modal as BaseModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover as BasePopover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip as BaseTooltip,
} from '@chakra-ui/react';
import { Meta } from '@storybook/react';

import { theme } from '../../modules/theme';
import { Button } from '../Button';

import { InverseMode } from '.';

const HEADER = 'Inverse Mode Provider';
const BODY = 'Wrapping a component with this provider will force the inverse theme to be used.';

export default {
  title: 'Utilities/InverseMode',
} as Meta;

export const Modal = () => {
  return (
    <BaseModal isCentered isOpen onClose={() => {}}>
      <ModalOverlay />
      <InverseMode>
        <ModalContent>
          <ModalHeader>{HEADER}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{BODY}</ModalBody>

          <ModalFooter>
            <Button>Close</Button>
          </ModalFooter>
        </ModalContent>
      </InverseMode>
    </BaseModal>
  );
};

export const Popover = () => {
  return (
    <BasePopover>
      <PopoverTrigger>
        <Button w="min-content">Button</Button>
      </PopoverTrigger>
      <InverseMode>
        <PopoverContent>
          <PopoverArrow />
          <PopoverBody>
            {BODY}
            <Button size="xs" mt={theme.sizes['2']} mb={theme.sizes['1']}>
              Button
            </Button>
          </PopoverBody>
        </PopoverContent>
      </InverseMode>
    </BasePopover>
  );
};

export const Tooltip = () => {
  return (
    <BaseTooltip
      label={
        <>
          A tooltip is inverse by default. However, if you want to put more complex elements inside,
          you should wrap them with this provider.
          <InverseMode>
            <Button size="xs" ml={theme.sizes['2']}>
              Button
            </Button>
          </InverseMode>
        </>
      }
      aria-label="Tooltip"
      hasArrow
    >
      <Button w="min-content">Button</Button>
    </BaseTooltip>
  );
};
