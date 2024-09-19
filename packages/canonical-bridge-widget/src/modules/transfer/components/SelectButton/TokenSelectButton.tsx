import { ButtonProps, Flex, Text, useColorMode, Button, useTheme } from '@bnb-chain/space';
import { CaretDownIcon } from '@bnb-chain/icons';

import { IconImage } from '@/core/components/IconImage';
import { BridgeToken } from '@/modules/bridges';

export interface SelectButtonProps extends Omit<ButtonProps, 'value'> {
  token?: BridgeToken;
}

export function TokenSelectButton(props: SelectButtonProps) {
  const { token, ...restProps } = props;
  const { colorMode } = useColorMode();

  const theme = useTheme();

  return (
    <Button
      borderRadius={'24px'}
      flexShrink={0}
      h={'40px'}
      p={'4px 8px 4px 4px'}
      justifyContent={'space-between'}
      gap={'8px'}
      background={'#373943'}
      _hover={{
        background: theme.colors[colorMode].button.select.background.hover,
      }}
      color={theme.colors[colorMode].text.primary}
      {...restProps}
    >
      <Flex gap={'8px'} alignItems={'center'} position={'relative'} overflow="hidden">
        <IconImage
          src={token?.icon}
          w={'32px'}
          h={'32px'}
          fallbackBgColor={theme.colors[colorMode].support.primary[4]}
        />
        <Flex
          flexDir={'column'}
          alignItems={'flex-start'}
          whiteSpace="nowrap"
          overflow="hidden"
          textAlign="left"
          sx={{
            p: {
              w: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
          }}
        >
          <Text fontSize={'16px'} lineHeight={'24px'}>
            {token?.symbol}
          </Text>
        </Flex>
      </Flex>
      <CaretDownIcon w={'24px'} h={'24px'} color={theme.colors[colorMode].button.select.arrow} />
    </Button>
  );
}
