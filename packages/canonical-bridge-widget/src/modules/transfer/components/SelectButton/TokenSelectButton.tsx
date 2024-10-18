import { ButtonProps, Flex, Text, useColorMode, Button, useTheme, Box } from '@bnb-chain/space';
import { CaretDownIcon } from '@bnb-chain/icons';
import { useMemo } from 'react';

import { IconImage } from '@/core/components/IconImage';
import { IBridgeToken } from '@/modules/aggregator/types';
import { TokenInfoTooltip } from '@/modules/transfer/components/TransferOverview/RouteInfo/TokenInfoTooltip';
import { formatTokenUrl } from '@/core/utils/string';
import { useAppSelector } from '@/modules/store/StoreProvider';

export interface SelectButtonProps extends Omit<ButtonProps, 'value'> {
  token?: IBridgeToken;
}

export function TokenSelectButton(props: SelectButtonProps) {
  const { token, ...restProps } = props;
  const { colorMode } = useColorMode();
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const theme = useTheme();

  const tokenUrl = useMemo(() => {
    return token ? formatTokenUrl(fromChain?.tokenUrlPattern, token.address) : '';
  }, [token, fromChain?.tokenUrlPattern]);

  return (
    <Button
      borderRadius={'24px'}
      flexShrink={0}
      h={'40px'}
      p={'4px 8px 4px 4px'}
      justifyContent={'space-between'}
      gap={'8px'}
      background={theme.colors[colorMode].button.select.background.default}
      _hover={{
        background: theme.colors[colorMode].button.select.background.hover,
      }}
      color={theme.colors[colorMode].text.primary}
      {...restProps}
    >
      <Flex gap={'8px'} alignItems={'center'} position={'relative'} overflow="hidden">
        <TokenInfoTooltip tokenAddress={token?.address ?? ''} tokenLinkUrl={tokenUrl}>
          <Box>
            <IconImage
              src={token?.icon}
              w={'32px'}
              h={'32px'}
              fallbackBgColor={theme.colors[colorMode].support.primary[4]}
            />
          </Box>
        </TokenInfoTooltip>
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
            {token?.displaySymbol}
          </Text>
        </Flex>
      </Flex>
      <CaretDownIcon w={'24px'} h={'24px'} color={theme.colors[colorMode].button.select.arrow} />
    </Button>
  );
}
