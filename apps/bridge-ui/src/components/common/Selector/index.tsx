import { MenuCloseIcon } from '@node-real/icons';
import {
  Button,
  ButtonProps,
  Circle,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  useDisclosure,
} from '@node-real/uikit';

export interface SelectorProps extends Omit<ButtonProps, 'title' | 'onChange'> {
  title: React.ReactNode;
  value: any;
  options: Array<{
    value: any;
    icon: React.ReactNode;
    label: React.ReactNode;
    rightElement?: React.ReactNode;
  }>;
  onChange: (value: any) => void;
}

export function Selector(props: SelectorProps) {
  const { title, value, options, onChange, children, ...restProps } = props;

  const { isOpen, onClose, onOpen } = useDisclosure();

  const onChangeValue = (value: any) => {
    onClose();
    onChange(value);
  };

  return (
    <>
      <Button
        onClick={onOpen}
        borderRadius={16}
        flexShrink={0}
        h={40}
        px={12}
        gap={8}
        bg={'bg.bottom'}
        _hover={{
          bg: 'bg.top.active',
        }}
        {...restProps}
      >
        {children}
        <MenuCloseIcon />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalCloseButton />
        <ModalHeader>{title}</ModalHeader>
        <ModalBody
          display="flex"
          flexDir="column"
          gap={16}
          maxH={420}
          overflowY="auto"
        >
          {options.map((item, index) => {
            return (
              <Flex
                key={index}
                onClick={() => onChangeValue(item.value)}
                alignItems="center"
                transition="all"
                transitionDuration="normal"
                h={60}
                borderRadius={16}
                bg="bg.bottom"
                px={16}
                gap={16}
                _hover={{
                  bg: 'bg.top.active',
                }}
                fontSize={20}
                cursor="pointer"
                flexShrink={0}
              >
                <Circle boxSize={28} overflow="hidden">
                  {item.icon}
                </Circle>
                {item.label}
                {item.rightElement}
              </Flex>
            );
          })}
        </ModalBody>
      </Modal>
    </>
  );
}
