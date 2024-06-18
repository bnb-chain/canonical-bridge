import { TokenInfo } from '@/bridges/index/types';
import { CircleImage } from '@/components/common/CircleImage';
import { Tag } from '@/components/common/Tag';
import { MenuCloseIcon } from '@node-real/icons';
import {
  Button,
  ButtonProps,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  useDisclosure,
  Text,
} from '@node-real/uikit';

export interface TokenSelectorProps
  extends Omit<ButtonProps, 'title' | 'onChange'> {
  title?: React.ReactNode;
  value: any;
  tokens: TokenInfo[];
  onChange: (value: any) => void;
}

export function TokenSelector(props: TokenSelectorProps) {
  const {
    title = 'Select a token',
    value,
    tokens,
    onChange,
    children,
    ...restProps
  } = props;

  const { isOpen, onClose, onOpen } = useDisclosure();

  const onChangeValue = (value: any) => {
    onClose();
    onChange(value);
  };

  const selectedToken = tokens.find((item) => item.symbol === value);

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
        {selectedToken && (
          <Flex gap={12}>
            <CircleImage src={selectedToken.icon} />
            <Text>{selectedToken.symbol}</Text>
          </Flex>
        )}
        <MenuCloseIcon />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalCloseButton />
        <ModalHeader>{title}</ModalHeader>
        <ModalBody
          display="flex"
          flexDir="column"
          gap={8}
          maxH={420}
          overflowY="auto"
        >
          {tokens.map((item) => {
            return (
              <Flex
                key={item.symbol}
                onClick={() => onChangeValue(item)}
                alignItems="center"
                transition="all"
                transitionDuration="normal"
                borderRadius={8}
                bg="bg.bottom"
                px={16}
                py={8}
                gap={12}
                _hover={{
                  bg: 'bg.top.active',
                }}
                fontSize={16}
                cursor="pointer"
                flexShrink={0}
              >
                <CircleImage src={item.icon} />
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  flex={1}
                  gap={8}
                >
                  <Flex flexDir="column" gap={2} flex={1}>
                    {item.name}
                    <Flex gap={8}>
                      {item.tags.map((tag) => {
                        return <Tag key={tag}>{tag}</Tag>;
                      })}
                    </Flex>
                  </Flex>
                  <Text flexShrink={0}>{item.symbol}</Text>
                </Flex>
              </Flex>
            );
          })}
        </ModalBody>
      </Modal>
    </>
  );
}
