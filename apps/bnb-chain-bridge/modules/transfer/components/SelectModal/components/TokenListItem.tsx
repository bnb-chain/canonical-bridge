import { FlexProps, useColorMode, Flex, theme, Link, Text, formatAddress } from '@bnb-chain/space';

import { IconImage } from '@/core/components/IconImage';
import { ExLinkIcon } from '@/core/components/icons/ExLinkIcon';
import { BridgeToken, isAvailableChainOrToken, useTokenUrl } from '@/modules/bridges/main';
import { UnavailableTag } from '@/modules/transfer/components/SelectModal/components/UnavailableTag';

interface TokenListItemProps extends FlexProps {
  data: BridgeToken;
  showTag?: boolean;
  chainId?: number;
  unavailableTips?: string;
}

export function TokenListItem(props: TokenListItemProps) {
  const { data, showTag = true, chainId, unavailableTips, ...restProps } = props;

  const { colorMode } = useColorMode();
  const tokenUrl = useTokenUrl(chainId, data.address);

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      px={theme.sizes['5']}
      py={theme.sizes['2']}
      gap={theme.sizes['3']}
      transitionDuration="normal"
      transitionProperty="colors"
      cursor="pointer"
      _hover={{
        bg: theme.colors[colorMode].layer[3].hover,
      }}
      {...restProps}
    >
      <Flex alignItems="center" gap={theme.sizes['3']} overflow="hidden">
        <IconImage boxSize={theme.sizes['8']} src={data.icon} alt={data.name} />
        <Flex flexDir="column" gap={theme.sizes['1']} overflow="hidden">
          <Text textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
            {data.symbol}
          </Text>
          <Flex
            alignItems="center"
            gap={theme.sizes['1']}
            fontSize={theme.sizes['3']}
            color={theme.colors[colorMode].text.secondary}
          >
            {data.address ? (
              <>
                {formatAddress({ value: data.address?.toLowerCase() })}
                <Link
                  isExternal
                  href={tokenUrl}
                  display="inline-flex"
                  onClick={(e) => e.stopPropagation()}
                  color="currentColor"
                  _hover={
                    tokenUrl
                      ? {
                          color: theme.colors[colorMode].text.primary,
                        }
                      : undefined
                  }
                >
                  {tokenUrl && <ExLinkIcon boxSize={theme.sizes['4']} />}
                </Link>
              </>
            ) : (
              '-'
            )}
          </Flex>
        </Flex>
      </Flex>
      {showTag && !isAvailableChainOrToken(data) && <UnavailableTag tips={unavailableTips} />}
    </Flex>
  );
}
