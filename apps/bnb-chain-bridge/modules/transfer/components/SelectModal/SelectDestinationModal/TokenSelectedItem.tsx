import { theme, useColorMode } from '@bnb-chain/space';

import { BridgeToken } from '@/modules/bridges';
import { TokenListItem } from '@/modules/transfer/components/SelectModal/components/TokenListItem';

interface TokenSelectedItem {
  data: BridgeToken;
  tokenUrl?: string;
}

export function TokenSelectedItem(props: TokenSelectedItem) {
  const { data, tokenUrl } = props;

  const { colorMode } = useColorMode();

  return (
    <TokenListItem
      data={data}
      border={`1px solid ${theme.colors[colorMode].support.brand[3]}`}
      borderRadius={theme.sizes['4']}
      px={theme.sizes['5']}
      py={theme.sizes['4']}
      mb={theme.sizes['6']}
      bg="rgba(255, 233, 0, 0.06)"
      _hover={{}}
      cursor="default"
      showTag={false}
      tokenUrl={tokenUrl}
    />
  );
}