import { Flex, useColorMode } from '@chakra-ui/react';
import { WarningTriangleSolidIcon, ArrowNavigationTopRight } from '@bnb-chain/icons';

import { theme } from '../../../modules/theme';

type Props = {
  children: React.ReactNode;
  variant: 'outline' | 'solid' | 'warning';
  link?: string;
  target?: string;
};

export const TagBadge = ({ children, variant, link, target, ...otherProps }: Props) => {
  const { colorMode } = useColorMode();

  return (
    <Flex
      fontSize={theme.sizes['3']}
      lineHeight={theme.sizes['3.5']}
      width={'fit-content'}
      borderRadius={theme.sizes['0.5']}
      height={theme.sizes['4']}
      px={theme.sizes['1']}
      marginLeft={theme.sizes['2']}
      minW={'unset'}
      gap={theme.sizes['0.5']}
      alignItems={'center'}
      fontWeight={variant === 'warning' ? '400' : '500'}
      cursor={link ? 'pointer' : 'default'}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (link) {
          window.open(link, target || '_blank');
        }
      }}
      bg={
        variant === 'solid'
          ? theme.colors[colorMode].button.primary.default
          : variant === 'warning'
          ? theme.colors[colorMode].support.warning['3']
          : 'transparent'
      }
      color={
        variant === 'solid' || variant === 'warning'
          ? theme.colors[colorMode].text.inverse
          : theme.colors[colorMode].button.primary.default
      }
      border={
        variant === 'warning'
          ? 'none'
          : `1px solid ${theme.colors[colorMode].button.primary.default}`
      }
      _hover={{
        bg: variant === 'warning' ? theme.colors[colorMode].support.warning['2'] : 'unset',
        svg: {
          color: `${theme.colors[colorMode].text.inverse}`,
        },
      }}
      sx={{
        svg: {
          color: `${theme.colors[colorMode].text.inverse} !important`,
        },
      }}
      {...otherProps}
    >
      {variant === 'warning' && (
        <WarningTriangleSolidIcon w={theme.sizes['3']} h={theme.sizes['3']} />
      )}
      {children}
      {variant === 'warning' && (
        <ArrowNavigationTopRight w={theme.sizes['3.5']} h={theme.sizes['3.5']} />
      )}
    </Flex>
  );
};
