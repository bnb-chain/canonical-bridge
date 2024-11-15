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
import { ChainType } from '@bnb-chain/canonical-bridge-sdk';

import { isNativeToken } from '@/core/utils/address.ts';

interface TokenTooltipProps {
  tokenLinkUrl: string;
  tokenAddress: string;
  children: React.ReactNode;
  isReceiveArea?: boolean;
  chainType?: ChainType;
}

export const TokenInfoTooltip = ({
  children,
  tokenAddress,
  tokenLinkUrl,
  isReceiveArea,
  chainType = 'evm',
}: TokenTooltipProps) => {
  const theme = useTheme();
  const nativeToken = useMemo(
    () => isNativeToken(tokenAddress, chainType),
    [chainType, tokenAddress],
  );

  return (
    <Flex className="bccb-widget-route-token-tooltip" display={'inline-block'} w={'auto'}>
      <LightMode>
        <Popover placement="top-start" trigger={'hover'} strategy={'fixed'} autoFocus={false}>
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
