import { CloseIcon } from '@bnb-chain/icons';
import { Flex, Modal, ModalContent, ModalOverlay, useColorMode, useTheme } from '@bnb-chain/space';

import { SearchInput } from '@/modules/transfer/components/SelectModal/components/SearchInput';
import { NoResultFound } from '@/modules/transfer/components/SelectModal/components/NoResultFound';

interface BaseModalProps {
  title: React.ReactNode;
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  onSearch: (value: string) => void;
  placeholder: string;
  isNoResult: boolean;
}

export function BaseModal(props: BaseModalProps) {
  const { isOpen, title, children, onClose, onSearch, placeholder, isNoResult } = props;

  const theme = useTheme();
  const { colorMode } = useColorMode();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        background={theme.colors[colorMode].background.modal}
        borderRadius={'24px'}
        p={0}
        h={'665px'}
        w={'435px'}
        overflow="hidden"
      >
        <Flex
          h={'64px'}
          px={'20px'}
          py={0}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          lineHeight={1.4}
          fontWeight={500}
          fontSize={'20px'}
          borderBottom={`1px solid ${theme.colors[colorMode].border['3']}`}
          flexShrink={0}
        >
          <Flex boxSize={'24px'}></Flex>
          {title}
          <CloseIcon
            boxSize={'24px'}
            onClick={onClose}
            cursor="pointer"
            color={theme.colors[colorMode].modal.close.default}
            _hover={{
              color: theme.colors[colorMode].modal.close.hover,
            }}
          />
        </Flex>
        <Flex flexDir="column" p="24px 20px 16px" flex={1}>
          <SearchInput onChange={onSearch} placeholder={placeholder} />
          <Flex flexDir="column" mt={'24px'} flex={1} overflowY="auto">
            {isNoResult ? <NoResultFound /> : <>{children}</>}
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
