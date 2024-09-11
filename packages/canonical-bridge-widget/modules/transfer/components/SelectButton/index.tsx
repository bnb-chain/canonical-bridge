import { ButtonProps, Flex, Text, useColorMode, Button } from '@bnb-chain/space';
import { CaretDownIcon } from '@bnb-chain/icons';

import { IconImage } from '@/core/components/IconImage';
import { BridgeChain, BridgeToken } from '@/modules/bridges/main/types';
import { useAppSelector } from '@/modules/store/StoreProvider';

export interface SelectButtonProps extends Omit<ButtonProps, 'value'> {
  network?: BridgeChain;
  token?: BridgeToken;
}

export function SelectButton(props: SelectButtonProps) {
  const { network, token, ...restProps } = props;
  const theme = useAppSelector((state) => state.theme.themeConfig);

  const { colorMode } = useColorMode();

  return (
    <Button
      borderRadius={'8px'}
      flexShrink={0}
      h={'64px'}
      px={'16px'}
      py={'12px'}
      // w={'100%'}
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
          src={token?.icon}
          w={'32px'}
          h={'32px'}
          fallbackBgColor={theme.colors[colorMode].support.primary[4]}
        />
        <IconImage
          src={network?.icon}
          w={'16px'}
          h={'16px'}
          position={'absolute'}
          top={'20px'}
          left={'20px'}
          fallbackBgColor={theme.colors[colorMode].support.primary[3]}
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
            {token?.symbol ?? 'Select Token'}
          </Text>
          <Text
            fontSize={'14px'}
            fontWeight={400}
            lineHeight={'16px'}
            color={theme.colors[colorMode].button.select.text}
          >
            {network?.name ?? 'Select Network'}
          </Text>
        </Flex>
      </Flex>
      <CaretDownIcon w={'24px'} h={'24px'} color={theme.colors[colorMode].button.select.arrow} />
    </Button>
  );
}
