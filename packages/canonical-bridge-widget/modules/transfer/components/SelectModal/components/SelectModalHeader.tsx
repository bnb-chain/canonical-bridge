import { ArrowLeftIcon, CloseIcon } from '@bnb-chain/icons';
import { Box, Flex, ModalHeaderProps, theme, useColorMode } from '@bnb-chain/space';

interface SelectModalHeaderProps extends Omit<ModalHeaderProps, 'title'> {
  showBack?: boolean;
  onClose: () => void;
  onBack?: () => void;
}

export function SelectModalHeader(props: SelectModalHeaderProps) {
  const { children, showBack = false, onClose, onBack } = props;

  const { colorMode } = useColorMode();

  return (
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
      {showBack ? (
        <ArrowLeftIcon
          boxSize={'24px'}
          onClick={onBack}
          cursor="pointer"
          color={theme.colors[colorMode].text.tertiary}
          _hover={{
            color: theme.colors[colorMode].text.primary,
          }}
        />
      ) : (
        <Box boxSize={'24px'} />
      )}
      {children}
      <CloseIcon
        boxSize={'24px'}
        onClick={onClose}
        cursor="pointer"
        color={theme.colors[colorMode].text.tertiary}
        _hover={{
          color: theme.colors[colorMode].text.primary,
        }}
      />
    </Flex>
  );
}
