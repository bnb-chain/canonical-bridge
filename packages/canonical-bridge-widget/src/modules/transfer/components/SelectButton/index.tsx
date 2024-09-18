import { ButtonProps, Flex, Text, useColorMode, Button, useTheme } from '@bnb-chain/space';
import { CaretDownIcon } from '@bnb-chain/icons';

import { IconImage } from '@/core/components/IconImage';
import { IBridgeChain } from '@/modules/aggregator/types';

export interface SelectButtonProps extends Omit<ButtonProps, 'value'> {
  network?: IBridgeChain;
  // token?: BridgeToken;
}

export function SelectButton(props: SelectButtonProps) {
  const { network, ...restProps } = props;
  const theme = useTheme();

  const { colorMode } = useColorMode();

  return (
    <Button
      borderRadius={'8px'}
      flexShrink={0}
      h={'64px'}
      px={'16px'}
      py={'12px'}
      justifyContent={'space-between'}
      gap={'8px'}
      background={theme.colors[colorMode].button.select.background.default}
      _hover={{
        background: theme.colors[colorMode].button.select.background.hover,
      }}
      color={theme.colors[colorMode].text.primary}
      {...restProps}
    >
      <Flex gap={'12px'} alignItems={'center'} position={'relative'} overflow="hidden">
        <IconImage
          src={network?.icon}
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
          <Text fontSize={'16px'} lineHeight={'24px'} fontWeight={400}>
            {network?.name ?? 'Select Network'}
          </Text>
        </Flex>
      </Flex>
      <CaretDownIcon w={'24px'} h={'24px'} color={theme.colors[colorMode].button.select.arrow} />
    </Button>
  );
}
