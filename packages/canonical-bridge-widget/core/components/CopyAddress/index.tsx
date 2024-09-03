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
        h={theme.sizes['5']}
        w={theme.sizes['5']}
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
          bottom={`calc(100% + ${theme.sizes['2']})`}
          left={'50%'}
          transform={'translateX(-50%)'}
          background={theme.colors[colorMode].layer.inverse}
          padding={`${theme.sizes['1']} ${theme.sizes['2']}`}
          borderRadius={theme.sizes['1']}
          color={theme.colors[colorMode].layer[3].default}
          fontSize={theme.sizes['3']}
          whiteSpace={'nowrap'}
          _after={{
            content: '""',
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: `${theme.sizes[1]} solid transparent`,
            borderRight: `${theme.sizes[1]} solid transparent`,
            borderTop: `${theme.sizes[1]} solid ${theme.colors[colorMode].layer.inverse}`,
          }}
          {...tooltipStyle}
        >
          Copied
        </Box>
      )}
    </Flex>
  );
};
