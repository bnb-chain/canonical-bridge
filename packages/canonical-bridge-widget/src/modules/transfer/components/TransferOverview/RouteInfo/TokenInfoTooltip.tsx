import {
  Box,
  Flex,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useTheme,
  LightMode,
  Portal,
} from '@bnb-chain/space';
import { useMemo } from 'react';
import { ChainType, IBridgeTokenBaseInfo, isNativeToken } from '@bnb-chain/canonical-bridge-sdk';

interface TokenTooltipProps {
  tokenLinkUrl: string;
  tokenInfo?: IBridgeTokenBaseInfo;
  children: React.ReactNode;
  isReceiveArea?: boolean;
  chainType?: ChainType;
  offset?: [number, number];
}

export const TokenInfoTooltip = ({
  children,
  tokenInfo,
  tokenLinkUrl,
  isReceiveArea,
  chainType = 'evm',
  offset,
  ...restProps
}: TokenTooltipProps) => {
  const tokenAddress = tokenInfo?.address ?? '';

  const theme = useTheme();
  const nativeToken = useMemo(
    () => isNativeToken(tokenAddress, chainType),
    [chainType, tokenAddress],
  );

  return (
    <Flex
      className="bccb-widget-route-token-tooltip"
      display={'inline-block'}
      w={'auto'}
      {...restProps}
    >
      <LightMode>
        <Popover
          placement="top-start"
          trigger={'hover'}
          strategy={'fixed'}
          autoFocus={false}
          offset={offset}
        >
          <PopoverTrigger>{children}</PopoverTrigger>
          <Portal>
            <PopoverContent
              className="bccb-widget-route-token-tooltip-content"
              borderRadius={'4px'}
              maxW={'280px'}
              marginLeft={isReceiveArea ? '-36px' : ''}
              marginBottom={isReceiveArea ? '-4px' : ''}
            >
              <PopoverArrow className="tooltip-arrow" />
              <PopoverBody
                className="bccb-widget-route-token-tooltip-body"
                px={'8px'}
                py={'7px'}
                onClick={(e) => e.stopPropagation()}
              >
                <>
                  <Box color={theme.colors.light.text.primary} fontSize={'12px'} fontWeight={400}>
                    {nativeToken ? 'Native token' : 'Token address:'}
                  </Box>
                  {!nativeToken && (
                    <Box color={theme.colors.light.text.primary} fontSize={'12px'} fontWeight={700}>
                      {tokenAddress && (
                        <Link
                          isExternal
                          href={tokenLinkUrl}
                          display="block"
                          overflowWrap={'break-word'}
                          pointerEvents={'all'}
                          color="currentColor"
                          _hover={
                            tokenLinkUrl
                              ? {
                                  color: theme.colors.light.modal.item.text.primary,
                                }
                              : undefined
                          }
                        >
                          {tokenAddress}
                        </Link>
                      )}
                    </Box>
                  )}
                </>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      </LightMode>
    </Flex>
  );
};
