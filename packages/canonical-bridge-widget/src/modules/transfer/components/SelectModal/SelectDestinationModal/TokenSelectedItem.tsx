import { useColorMode, useTheme } from '@bnb-chain/space';

import { TokenListItem } from '@/modules/transfer/components/SelectModal/components/TokenListItem';
import { IBridgeToken } from '@/modules/aggregator/types';

interface TokenSelectedItem {
  data: IBridgeToken;
  tokenUrl?: string;
}

export function TokenSelectedItem(props: TokenSelectedItem) {
  const { data, tokenUrl } = props;

  const { colorMode } = useColorMode();
  const theme = useTheme();

  return (
    <TokenListItem
      data={data}
      border={`1px solid ${theme.colors[colorMode].text.brand}`}
      borderRadius={'16px'}
      px={'20px'}
      py={'16px'}
      mb={'24px'}
      bg="rgba(255, 233, 0, 0.06)"
      _hover={{}}
      cursor="default"
      showTag={false}
      tokenUrl={tokenUrl}
    />
  );
}
