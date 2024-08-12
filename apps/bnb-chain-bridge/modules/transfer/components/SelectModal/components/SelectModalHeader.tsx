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
      h={theme.sizes['16']}
      px={theme.sizes['5']}
      py={0}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      lineHeight={1.4}
      fontWeight={500}
      fontSize={theme.sizes['5']}
      borderBottom={`1px solid ${theme.colors[colorMode].border['3']}`}
      flexShrink={0}
    >
      {showBack ? (
        <ArrowLeftIcon
          boxSize={theme.sizes['6']}
          onClick={onBack}
          cursor="pointer"
          color={theme.colors[colorMode].text.tertiary}
          _hover={{
            color: theme.colors[colorMode].text.primary,
          }}
        />
      ) : (
        <Box boxSize={theme.sizes['6']} />
      )}
      {children}
      <CloseIcon
        boxSize={theme.sizes['6']}
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
