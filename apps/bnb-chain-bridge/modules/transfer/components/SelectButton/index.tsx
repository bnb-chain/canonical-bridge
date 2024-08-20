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
      borderRadius={theme.sizes['4']}
      flexShrink={0}
      h={theme.sizes['16']}
      px={theme.sizes['4']}
      py={theme.sizes['3']}
      w={'100%'}
      maxW={'250px'}
      justifyContent={'space-between'}
      gap={theme.sizes['2']}
      background={theme.colors[colorMode].layer['3'].default}
      _hover={{
        background: theme.colors[colorMode].layer['3'].hover,
      }}
      color={theme.colors[colorMode].text.primary}
      {...restProps}
    >
      <Flex gap={theme.sizes['3']} alignItems={'center'} position={'relative'} overflow="hidden">
        <IconImage
          src={token?.icon}
          w={theme.sizes['8']}
          h={theme.sizes['8']}
          fallbackBgColor={theme.colors[colorMode].support.primary[4]}
        />
        <IconImage
          src={network?.icon}
          w={theme.sizes['4']}
          h={theme.sizes['4']}
          position={'absolute'}
          top={theme.sizes['5']}
          left={theme.sizes['5']}
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
          <Text fontSize={theme.sizes['4']} lineHeight={theme.sizes['6']}>
            {token?.symbol ?? 'Select Token'}
          </Text>
          <Text
            fontSize={theme.sizes['3.5']}
            fontWeight={400}
            lineHeight={theme.sizes['4']}
            color={theme.colors[colorMode].text.placeholder}
          >
            {network?.name ?? 'Select Network'}
          </Text>
        </Flex>
      </Flex>
      <CaretDownIcon
        w={theme.sizes['6']}
        h={theme.sizes['6']}
        color={theme.colors[colorMode].text.secondary}
      />
    </Button>
  );
}
