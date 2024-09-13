import { CopyIcon } from '@bnb-chain/icons';
import {
  Box,
  theme,
  useClipboard,
  useColorMode,
  BoxProps,
  Flex,
  FlexProps,
  IconProps,
} from '@bnb-chain/space';

export const CopyAddress = ({
  content,
  tooltipStyle,
  iconStyle,
  ...otherProps
}: FlexProps & {
  content?: string;
  iconStyle?: IconProps;
  tooltipStyle?: BoxProps;
}) => {
  const { colorMode } = useColorMode();
  const { onCopy, hasCopied } = useClipboard(content || '');
  if (!content) {
    return null;
  }
  return (
    <Flex justifyContent={'center'} alignItems={'center'} position={'relative'} {...otherProps}>
      <CopyIcon
        color={theme.colors[colorMode].text.placeholder}
        h={'20px'}
        w={'20px'}
        cursor={'pointer'}
        _hover={{ color: theme.colors[colorMode].text.primary }}
        {...iconStyle}
        onClick={() => {
          onCopy();
        }}
      />
      {hasCopied && (
        <Box
          position={'absolute'}
          bottom={`calc(100% + 8px)`}
          left={'50%'}
          transform={'translateX(-50%)'}
          background={theme.colors[colorMode].layer.inverse}
          padding={`4px 8px`}
          borderRadius={'4px'}
          color={theme.colors[colorMode].layer[3].default}
          fontSize={'12px'}
          whiteSpace={'nowrap'}
          _after={{
            content: '""',
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: `4px solid transparent`,
            borderRight: `4px solid transparent`,
            borderTop: `4px solid ${theme.colors[colorMode].layer.inverse}`,
          }}
          {...tooltipStyle}
        >
          Copied
        </Box>
      )}
    </Flex>
  );
};
