import { CloseIcon } from '@bnb-chain/icons';
import { Flex, Modal, ModalContent, ModalOverlay, useColorMode, useTheme } from '@bnb-chain/space';
import { useEffect } from 'react';

import { SearchInput } from '@/modules/aggregator/components/SelectModal/components/SearchInput';
import { NoResultFound } from '@/modules/aggregator/components/SelectModal/components/NoResultFound';

interface BaseModalProps {
  title: React.ReactNode;
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  onSearch: (value: string) => void;
  placeholder: string;
  isNoResult: boolean;
  className?: string;
}

export function BaseModal(props: BaseModalProps) {
  const { isOpen, title, children, onClose, onSearch, placeholder, isNoResult, className } = props;

  const theme = useTheme();
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (!isOpen) {
      onSearch('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered autoFocus={false}>
      <ModalOverlay className={`${className}-overlay`} />
      <ModalContent
        className={`${className}-content`}
        background={theme.colors[colorMode].background.modal}
        borderRadius={{ base: '0', md: '24px' }}
        p={0}
        h={{ base: '100vh', md: '665px' }}
        w={{ base: '100vw', md: '435px' }}
        maxW="100%"
        overflow="hidden"
        marginInline={0}
      >
        <Flex
          className={`${className}-header`}
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
            className={`${className}-close-button`}
            boxSize={'24px'}
            onClick={onClose}
            cursor="pointer"
            color={theme.colors[colorMode].modal.close.default}
            _hover={{
              color: theme.colors[colorMode].modal.close.hover,
            }}
          />
        </Flex>
        <Flex flexDir="column" p="20px 0px 16px" flex={1}>
          <Flex px={'20px'} mb={'20px'}>
            <SearchInput
              className={`${className}-search`}
              onChange={onSearch}
              placeholder={placeholder}
            />
          </Flex>
          <Flex flexDir="column" flex={1} overflowY="auto">
            {isNoResult ? <NoResultFound /> : <>{children}</>}
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
