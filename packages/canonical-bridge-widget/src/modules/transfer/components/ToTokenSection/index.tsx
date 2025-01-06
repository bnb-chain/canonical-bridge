import {
  Box,
  Flex,
  useIntl,
  Text,
  useTheme,
  useColorMode,
  Typography,
  Link,
} from '@bnb-chain/space';
import { IBridgeToken, isSameAddress } from '@bnb-chain/canonical-bridge-sdk';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { IconImage } from '@/core/components/IconImage';
import { formatAppAddress } from '@/core/utils/address';
import { useSelection } from '@/modules/aggregator/hooks/useSelection';
import { InfoTooltip } from '@/core/components/InfoTooltip';
import { formatTokenUrl } from '@/core/utils/string';

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
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  return (
    <InfoTooltip label={token.name}>
      <Flex
        className="bccb-widget-to-token-item"
        data-to-name={token.name}
        data-to-address={token.address}
        data-to-symbol={token.symbol}
        data-to-display-symbol={token.displaySymbol}
        p="8px"
        h="48px"
        alignItems="center"
        gap="4px"
        borderRadius="8px"
        cursor="pointer"
        onClick={() => selectToToken(token.address)}
        border={theme.colors[colorMode].button.select.border}
        color={theme.colors[colorMode].button.select.color}
        bg={theme.colors[colorMode].button.select.background.default}
        _hover={{
          bg: theme.colors[colorMode].button.select.background.hover,
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
          <Text color={theme.colors[colorMode].text.tertiary}>{token.displaySymbol}</Text>
          <Link isExternal href={formatTokenUrl(fromChain?.tokenUrlPattern, token.address)}>
            {formatAppAddress({
              address: token.address,
            })}
          </Link>
        </Flex>
      </Flex>
    </InfoTooltip>
  );
}
