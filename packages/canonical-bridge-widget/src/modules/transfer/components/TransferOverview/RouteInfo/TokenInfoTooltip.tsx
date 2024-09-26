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

interface TokenTooltipProps {
  tokenLinkUrl: string;
  tokenAddress: string;
  children: React.ReactNode;
  isReceiveArea?: boolean;
}

export const TokenInfoTooltip = ({
  children,
  tokenAddress,
  tokenLinkUrl,
  isReceiveArea,
}: TokenTooltipProps) => {
  const theme = useTheme();

  return (
    <Flex display={'inline-block'} w={'auto'}>
      <LightMode>
        <Popover placement="top-start" trigger={'hover'} strategy={'fixed'} autoFocus={false}>
          <PopoverTrigger>{children}</PopoverTrigger>
          <Portal>
            <PopoverContent
              borderRadius={'4px'}
              maxW={'280px'}
              marginLeft={isReceiveArea ? '-36px' : ''}
              marginBottom={isReceiveArea ? '-4px' : ''}
            >
              <PopoverArrow />
              <PopoverBody px={'8px'} py={'7px'} onClick={(e) => e.stopPropagation()}>
                <Box>
                  <Box color={theme.colors.light.text.primary} fontSize={'12px'} fontWeight={400}>
                    Token address:
                  </Box>
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
                </Box>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      </LightMode>
    </Flex>
  );
};
