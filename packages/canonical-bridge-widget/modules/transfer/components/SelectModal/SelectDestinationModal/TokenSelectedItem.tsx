import { useColorMode } from '@bnb-chain/space';

import { BridgeToken } from '@/modules/bridges';
import { TokenListItem } from '@/modules/transfer/components/SelectModal/components/TokenListItem';
import { useAppSelector } from '@/modules/store/StoreProvider';

interface TokenSelectedItem {
  data: BridgeToken;
  tokenUrl?: string;
}

export function TokenSelectedItem(props: TokenSelectedItem) {
  const { data, tokenUrl } = props;

  const { colorMode } = useColorMode();
  const theme = useAppSelector((state) => state.theme.themeConfig);

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
