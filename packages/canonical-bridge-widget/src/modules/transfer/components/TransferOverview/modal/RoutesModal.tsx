import { CloseIcon } from '@bnb-chain/icons';
import { Flex, Modal, ModalContent, ModalOverlay, useColorMode, useTheme } from '@bnb-chain/space';
import { useEffect } from 'react';

import { useAppSelector } from '@/modules/store/StoreProvider';

interface RoutesModalProps {
  title: React.ReactNode;
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
}

export function RoutesModal(props: RoutesModalProps) {
  const { isOpen, title, children, onClose } = props;

  const theme = useTheme();
  const { colorMode } = useColorMode();

  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);

  useEffect(() => {
    if (transferActionInfo?.bridgeType) {
      onClose();
    }
  }, [onClose, transferActionInfo?.bridgeType]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'lg' }} isCentered>
      <ModalOverlay className="bccb-widget-modal-route-overlay" w={'100%'} />
      <ModalContent
        className="bccb-widget-modal-route-content"
        background={theme.colors[colorMode].background.modal}
        p={0}
        h={['100vh', '80vh', '665px']}
        w={['100%', '100%', '558px']}
        overflow={['auto', 'auto', 'auto', 'hidden']}
        margin={0}
      >
        <Flex
          className="bccb-widget-modal-route-header"
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
        <Flex
          className="bccb-widget-modal-route-wrapper"
          flexDir="column"
          p={['20px', '20px', '24px 20px 16px']}
          flex={1}
        >
          <Flex flexDir="column" mt={['0', '0', '0', '24px']} flex={1} overflowY="auto">
            {children}
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
