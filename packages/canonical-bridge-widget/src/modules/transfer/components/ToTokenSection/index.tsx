import {
  Box,
  Flex,
  useIntl,
  Text,
  useTheme,
  useColorMode,
  Typography,
  Link,
  Center,
} from '@bnb-chain/space';
import { IBridgeToken, isNativeToken, isSameAddress } from '@bnb-chain/canonical-bridge-sdk';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { IconImage } from '@/core/components/IconImage';
import { formatAppAddress } from '@/core/utils/address';
import { useSelection } from '@/modules/aggregator/hooks/useSelection';
import { InfoTooltip } from '@/core/components/InfoTooltip';
import { formatTokenUrl } from '@/core/utils/string';
import { useResponsive } from '@/core/hooks/useResponsive';
import { ExLinkIcon } from '@/core/components/icons/ExLinkIcon';

export function ToTokenSection() {
  const { formatMessage } = useIntl();
  const toTokens = useAppSelector((state) => state.transfer.toTokens);
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const toToken = useAppSelector((state) => state.transfer.toToken);

  if (toTokens.length < 2) {
    return null;
  }

  return (
    <Box className="bccb-widget-to-token-section">
      <Typography
        className="bccb-widget-to-token-header"
        color={theme.colors[colorMode].text.network.title}
        variant={'label'}
        size={'md'}
      >
        {formatMessage({ id: 'select.received-token.title' })}
      </Typography>
      <Flex
        className="bccb-widget-to-token-list"
        flexWrap={{ base: 'nowrap', md: 'wrap' }}
        overflow={{ base: 'auto', md: 'unset' }}
        mt="8px"
        gap="8px"
      >
        {toTokens.map((item) => (
          <ToTokenItem
            key={item.address}
            token={item}
            isSelected={isSameAddress(item.address, toToken?.address)}
          />
        ))}
      </Flex>
    </Box>
  );
}

function ToTokenItem({ token, isSelected }: { token: IBridgeToken; isSelected: boolean }) {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const { selectToToken } = useSelection();
  const { isMobile } = useResponsive();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);

  const tokenUrl = formatTokenUrl(fromChain?.tokenUrlPattern, token.address);

  return (
    <InfoTooltip label={token.name}>
      <Flex
        className="bccb-widget-to-token-item"
        data-to-name={token.name}
        data-to-address={token.address}
        data-to-symbol={token.symbol}
        data-to-display-symbol={token.displaySymbol}
        p={{ base: '8px', md: '8px 12px' }}
        h="48px"
        alignItems="center"
        gap="4px"
        borderRadius="8px"
        cursor="pointer"
        onClick={() => {
          if (isGlobalFeeLoading) return;
          selectToToken(token.address);
        }}
        border="1px solid"
        borderColor={
          isSelected
            ? theme.colors[colorMode].border.brand
            : theme.colors[colorMode].button.select.border
        }
        color={
          isSelected
            ? theme.colors[colorMode].border.brand
            : theme.colors[colorMode].button.select.color
        }
        bg={theme.colors[colorMode].button.select.background.default}
        _hover={{
          bg: isSelected ? undefined : theme.colors[colorMode].button.select.background.hover,
        }}
        fontWeight={500}
        fontSize={'14px'}
        lineHeight="16px"
        flexShrink={0}
      >
        <IconImage
          src={token.icon}
          boxSize={{ base: '16px', md: '20px' }}
          alignSelf={{ base: 'flex-start', md: 'auto' }}
        />
        <Flex
          alignItems={{ base: 'flex-start', md: 'center' }}
          gap={{ base: '0', md: '4px' }}
          flexDir={{ base: 'column', md: 'row' }}
        >
          <Text
            color={
              isSelected
                ? theme.colors[colorMode].text.primary
                : theme.colors[colorMode].text.tertiary
            }
          >
            {token.displaySymbol}
          </Text>

          {!isNativeToken(token.address, fromChain?.chainType) && (
            <>
              {isMobile ? (
                <Flex
                  alignItems="center"
                  gap="4px"
                  textDecoration={{ base: 'underline', md: 'unset' }}
                >
                  {formatAppAddress({
                    address: token.address,
                  })}
                  <Center boxSize="16px">
                    {isSelected && (
                      <Link
                        isExternal
                        href={tokenUrl}
                        color="inherit"
                        _hover={{ color: 'inherit' }}
                      >
                        <ExLinkIcon boxSize="100%" />
                      </Link>
                    )}
                  </Center>
                </Flex>
              ) : (
                <Link isExternal href={tokenUrl} color="inherit" _hover={{ color: 'inherit' }}>
                  {formatAppAddress({
                    address: token.address,
                    headLen: 4,
                  })}
                </Link>
              )}
            </>
          )}
        </Flex>
      </Flex>
    </InfoTooltip>
  );
}
