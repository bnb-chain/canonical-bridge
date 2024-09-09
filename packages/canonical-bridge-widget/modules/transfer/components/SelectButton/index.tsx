import { ButtonProps, Flex, Text, theme, useColorMode, Button } from '@bnb-chain/space';
import { CaretDownIcon } from '@bnb-chain/icons';

import { IconImage } from '@/core/components/IconImage';
import { BridgeChain, BridgeToken } from '@/modules/bridges/main/types';

export interface SelectButtonProps extends Omit<ButtonProps, 'value'> {
  network?: BridgeChain;
  token?: BridgeToken;
}

export function SelectButton(props: SelectButtonProps) {
  const { network, token, ...restProps } = props;

  const { colorMode } = useColorMode();

  return (
    <Button
      borderRadius={'16px'}
      flexShrink={0}
      h={'64px'}
      px={'16px'}
      py={'12px'}
      w={'100%'}
      maxW={'250px'}
      justifyContent={'space-between'}
      gap={'8px'}
      background={theme.colors[colorMode].layer['3'].default}
      _hover={{
        background: theme.colors[colorMode].layer['3'].hover,
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
            color={theme.colors[colorMode].text.placeholder}
          >
            {network?.name ?? 'Select Network'}
          </Text>
        </Flex>
      </Flex>
      <CaretDownIcon w={'24px'} h={'24px'} color={theme.colors[colorMode].text.secondary} />
    </Button>
  );
}
