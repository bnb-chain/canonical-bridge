import { BnbChainButton } from '@/app/transfer/components/BNBChain/BnbChainButton';
import { ChainInfo } from '@/bridges/index/types';
import { CircleImage } from '@/components/common/CircleImage';
import { Tag } from '@/components/common/Tag';
import { MenuCloseIcon } from '@node-real/icons';
import {
  ButtonProps,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  useDisclosure,
  Text,
} from '@node-real/uikit';

export interface ChainSelectorProps
  extends Omit<ButtonProps, 'title' | 'onChange'> {
  title: React.ReactNode;
  value: any;
  chains: ChainInfo[];
  onChange: (value: any) => void;
}

export function ChainSelector(props: ChainSelectorProps) {
  const { title, value, chains, onChange, children, ...restProps } = props;

  const { isOpen, onClose, onOpen } = useDisclosure();

  const onChangeValue = (value: any) => {
    onClose();
    onChange(value);
  };

  const selectedChain = chains.find((item) => item.id === value);

  return (
    <>
      <BnbChainButton
        onClick={onOpen}
        borderRadius={16}
        flexShrink={0}
        h={40}
        px={12}
        gap={8}
        background={`layer.3.default`}
        _hover={{
          background: 'layer.3.hover',
        }}
        color={'text.primary'}
        {...restProps}
      >
        {selectedChain && (
          <Flex gap={12}>
            <CircleImage src={selectedChain.icon} />
            <Text>{selectedChain.name}</Text>
          </Flex>
        )}
        <MenuCloseIcon />
      </BnbChainButton>

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
          {chains.map((item) => {
            return (
              <Flex
                key={item.id}
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
                <Flex flexDir="column" gap={2}>
                  <Text>{item.name}</Text>
                  <Flex gap={8}>
                    {item.tags.map((tag) => {
                      return <Tag key={tag}>{tag}</Tag>;
                    })}
                  </Flex>
                </Flex>
              </Flex>
            );
          })}
        </ModalBody>
      </Modal>
    </>
  );
}
