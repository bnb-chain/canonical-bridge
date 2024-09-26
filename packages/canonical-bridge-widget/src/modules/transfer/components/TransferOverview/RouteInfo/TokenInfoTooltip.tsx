import { Box, Flex, Link, Tooltip, useTheme } from '@bnb-chain/space';
import { useState } from 'react';

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
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Flex
      display={'inline-block'}
      w={'auto'}
      onMouseOver={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Tooltip
        isOpen={isOpen}
        closeDelay={700}
        label={
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
        }
        hasArrow
        placement="top-start"
        maxW={'280px'}
        marginLeft={isReceiveArea ? '-36px' : ''}
        marginBottom={isReceiveArea ? '-4px' : ''}
      >
        {children}
      </Tooltip>
    </Flex>
  );
};
