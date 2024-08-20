import {
  Button,
  ButtonProps,
  Flex,
  LightMode,
  Modal,
  ModalBody,
  ModalBodyProps,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalFooterProps,
  ModalOverlay,
  ModalProps,
  theme,
} from '@bnb-chain/space';
import { CloseIcon } from '@bnb-chain/icons';

import { TxSuccessIcon } from '@/core/components/icons/TxSuccessIcon';
import { TxErrorIcon } from '@/core/components/icons/TxErrorIcon';
import { TxApproveIcon } from '@/core/components/icons/TxApproveIcon';
import { TxConfirmingIcon } from '@/core/components/icons/TxConfirmingIcon';

const iconMap = {
  success: <TxSuccessIcon />,
  error: <TxErrorIcon />,
  approve: <TxApproveIcon />,
  confirming: <TxConfirmingIcon />,
};

export interface StateModalProps extends Omit<ModalProps, 'children'> {
  type?: keyof typeof iconMap;
  title: React.ReactNode;
  description?: React.ReactNode;
  buttonText?: React.ReactNode;
  mainButtonText?: React.ReactNode;
  closeButton?: React.ReactNode;
  onButtonClick?: () => void;
  onMainButtonClick?: () => void;
  mainButtonProps?: ButtonProps;
  footerProps?: ModalFooterProps;
  bodyProps?: ModalBodyProps;
}

export function StateModal(props: StateModalProps) {
  const {
    type = 'success',
    title,
    description,
    buttonText = 'OK',
    mainButtonText = '',
    onButtonClick,
    onMainButtonClick,
    closeButton,
    isOpen,
    onClose,
    mainButtonProps,
    bodyProps,
    footerProps,
    ...restProps
  } = props;

  const icon = iconMap[type];

  const onBeforeClose = () => {
    onButtonClick?.();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered {...restProps}>
      <LightMode>
        <ModalOverlay />

        <ModalContent borderRadius={theme.sizes['5']} maxW={'435px'}>
          <ModalCloseButton
            top={theme.sizes['6']}
            right={{ base: theme.sizes['6'], md: theme.sizes['6'] }}
            onClick={onBeforeClose}
          >
            <CloseIcon boxSize={theme.sizes['6']} />
          </ModalCloseButton>

          <ModalBody
            pt={theme.sizes['12']}
            px={theme.sizes['10']}
            pb={theme.sizes['6']}
            display="flex"
            flexDir="column"
            alignItems="center"
            {...bodyProps}
          >
            <Flex>{icon}</Flex>
            <Flex
              mt={theme.sizes['6']}
              fontSize={theme.sizes['6']}
              fontWeight={700}
              lineHeight="32px"
              color={theme.colors.light.text.primary}
            >
              {title}
            </Flex>
            {description && (
              <Flex
                mt={theme.sizes['2']}
                textAlign="center"
                color={theme.colors.light.text.tertiary}
                display={'inline-block'}
                whiteSpace="pre-line"
              >
                {description}
              </Flex>
            )}
          </ModalBody>

          <ModalFooter
            px={theme.sizes['10']}
            pb={theme.sizes['10']}
            justifyContent="center"
            flexDir={'column'}
            gap={theme.sizes['4']}
            {...footerProps}
          >
            {mainButtonText && (
              <Button
                size="lg"
                w={'100%'}
                fontSize={theme.sizes['4']}
                lineHeight={1.5}
                onClick={onMainButtonClick}
                {...mainButtonProps}
              >
                {mainButtonText}
              </Button>
            )}
            {closeButton ? (
              closeButton
            ) : (
              <Button
                size="lg"
                w={'100%'}
                fontSize={theme.sizes['4']}
                lineHeight={1.5}
                onClick={onBeforeClose}
              >
                {buttonText}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </LightMode>
    </Modal>
  );
}
