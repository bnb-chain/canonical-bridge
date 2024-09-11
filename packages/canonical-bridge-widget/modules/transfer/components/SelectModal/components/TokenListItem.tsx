import { FlexProps, useColorMode, Flex, Link, Text } from '@bnb-chain/space';

import { IconImage } from '@/core/components/IconImage';
import { ExLinkIcon } from '@/core/components/icons/ExLinkIcon';
import { BridgeToken, isAvailableChainOrToken } from '@/modules/bridges';
import { UnavailableTag } from '@/modules/transfer/components/SelectModal/components/UnavailableTag';
import { formatAppAddress } from '@/core/utils/address';
import { useAppSelector } from '@/modules/store/StoreProvider';

interface TokenListItemProps extends FlexProps {
  data: BridgeToken;
  showTag?: boolean;
  tokenUrl?: string;
  unavailableTips?: string;
}

export function TokenListItem(props: TokenListItemProps) {
  const { data, showTag = true, tokenUrl, unavailableTips, ...restProps } = props;
  const theme = useAppSelector((state) => state.theme.themeConfig);
  const { colorMode } = useColorMode();

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      px={'20px'}
      py={'8px'}
      gap={'12px'}
      transitionDuration="normal"
      transitionProperty="colors"
      cursor="pointer"
      bg={theme.colors[colorMode].modal.item.background.default}
      _hover={{
        bg: theme.colors[colorMode].modal.item.background.hover,
      }}
      {...restProps}
    >
      <Flex alignItems="center" gap={'12px'} overflow="hidden">
        <IconImage boxSize={'32px'} src={data.icon} alt={data.name} />
        <Flex flexDir="column" gap={'4px'} overflow="hidden">
          <Text
            textOverflow="ellipsis"
            overflow="hidden"
            whiteSpace="nowrap"
            color={theme.colors[colorMode].modal.item.text.primary}
          >
            {data.symbol}
          </Text>
          <Flex
            alignItems="center"
            gap={'4px'}
            fontSize={'12px'}
            color={theme.colors[colorMode].modal.item.text.secondary}
          >
            {data.address ? (
              <>
                {formatAppAddress({ address: data.address, transform: 'lowerCase' })}
                <Link
                  isExternal
                  href={tokenUrl}
                  display="inline-flex"
                  onClick={(e) => e.stopPropagation()}
                  color="currentColor"
                  _hover={
                    tokenUrl
                      ? {
                          color: theme.colors[colorMode].modal.item.text.primary,
                        }
                      : undefined
                  }
                >
                  {tokenUrl && <ExLinkIcon boxSize={'16px'} />}
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
