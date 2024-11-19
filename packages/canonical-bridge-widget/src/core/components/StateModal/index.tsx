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
  mainButtonIsDisabled?: boolean;
  closeButtonIsDisabled?: boolean;
  className?: string;
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
    mainButtonIsDisabled = false,
    closeButtonIsDisabled = false,
    onClose,
    className,
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
        <ModalOverlay className={`${className}-overlay`} />

        <ModalContent className={className} borderRadius={'20px'} maxW={'435px'}>
          <ModalCloseButton
            className="bccb-widget-modal-close-button"
            top={'24px'}
            right={{ base: '24px', md: '24px' }}
            onClick={onBeforeClose}
          >
            <CloseIcon boxSize={'24px'} />
          </ModalCloseButton>

          <ModalBody
            className="bccb-widget-modal-body"
            pt={'48px'}
            px={'40px'}
            pb={'24px'}
            display="flex"
            flexDir="column"
            alignItems="center"
            {...bodyProps}
          >
            <Flex className="bccb-widget-modal-body-icon">{icon}</Flex>
            <Flex
              className="bccb-widget-modal-body-title"
              mt={'24px'}
              fontSize={'24px'}
              fontWeight={700}
              lineHeight="32px"
              color={theme.colors.light.text.primary}
              textAlign={'center'}
              whiteSpace="nowrap"
            >
              {title}
            </Flex>
            {description && (
              <Flex
                className="bccb-widget-modal-body-description"
                mt={'8px'}
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
            className="bccb-widget-modal-footer"
            px={'40px'}
            pb={'40px'}
            justifyContent="center"
            flexDir={'column'}
            gap={'16px'}
            {...footerProps}
          >
            {mainButtonText && (
              <Button
                className="bccb-widget-modal-main-button"
                size="lg"
                w={'100%'}
                fontSize={'16px'}
                lineHeight={1.5}
                onClick={onMainButtonClick}
                isDisabled={mainButtonIsDisabled}
                {...mainButtonProps}
              >
                {mainButtonText}
              </Button>
            )}
            {closeButton ? (
              closeButton
            ) : (
              <Button
                className="bccb-widget-modal-second-button"
                size="lg"
                w={'100%'}
                fontSize={'16px'}
                lineHeight={1.5}
                onClick={onBeforeClose}
                isDisabled={closeButtonIsDisabled}
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
