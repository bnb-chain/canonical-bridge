import { ButtonProps, Flex, Text, useColorMode, Button, useTheme } from '@bnb-chain/space';
import { CaretDownIcon } from '@bnb-chain/icons';

import { IconImage } from '@/core/components/IconImage';
import { IBridgeChain } from '@/modules/aggregator/types';

export interface SelectButtonProps extends Omit<ButtonProps, 'value'> {
  isActive: boolean;
  chain?: IBridgeChain;
}

export function SelectButton(props: SelectButtonProps) {
  const { isActive = false, chain, ...restProps } = props;

  const theme = useTheme();
  const { colorMode } = useColorMode();

  return (
    <Button
      className="bccb-widget-network-button"
      borderRadius={'8px'}
      flexShrink={0}
      h={'48px'}
      padding={'12px'}
      justifyContent={'space-between'}
      gap={'8px'}
      background={theme.colors[colorMode].input.background}
      color={theme.colors[colorMode].text.primary}
      transitionDuration="normal"
      outline={
        isActive
          ? `2px solid ${theme.colors[colorMode].input.border.active}`
          : `1px solid ${theme.colors[colorMode].input.border.default}`
      }
      _hover={{
        outline: '2px solid',
        outlineColor: theme.colors[colorMode].input.border.hover,
      }}
      _active={{}}
      {...restProps}
    >
      <Flex gap={'8px'} alignItems={'center'} position={'relative'} overflow="hidden">
        <IconImage
          boxSize={'24px'}
          src={chain?.icon}
          fallbackBgColor={theme.colors[colorMode].support.primary[4]}
        />
        <Flex
          className="bccb-widget-network-name"
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
            {chain?.name ?? ''}
          </Text>
        </Flex>
      </Flex>
      <CaretDownIcon w={'24px'} h={'24px'} color={theme.colors[colorMode].button.select.arrow} />
    </Button>
  );
}
