import { Box, Flex, theme, useColorMode, useIntl } from '@bnb-chain/space';
import { useState } from 'react';

import { BridgeChain, BridgeToken, formatTokenUrl } from '@/modules/bridges';
import { NoNetworkIcon } from '@/core/components/icons/NoNetworkIcon';
import { VirtualList } from '@/core/components/VirtualList';
import { NoResultFound } from '@/modules/transfer/components/SelectModal/components/NoResultFound';
import { SearchInput } from '@/modules/transfer/components/SelectModal/components/SearchInput';
import { SectionTitle } from '@/modules/transfer/components/SelectModal/components/SectionTitle';
import { TokenListItem } from '@/modules/transfer/components/SelectModal/components/TokenListItem';

interface TokenSectionProps {
  tokens?: BridgeToken[];
  showNetworkTips: boolean;
  selectedNetwork?: BridgeChain;
  onSelect: (value: BridgeToken) => void;
}

export function TokenSection(props: TokenSectionProps) {
  const { tokens = [], showNetworkTips = true, selectedNetwork, onSelect } = props;

  const { formatMessage } = useIntl();
  const { colorMode } = useColorMode();
  const [keyword, setKeyword] = useState('');

  const onChangeKeyword = (keyword: string) => {
    setKeyword(keyword);
  };

  const filteredTokens = tokens.filter((item) => {
    const tmpKeyword = keyword.toLowerCase();
    if (item.symbol.toLowerCase().includes(tmpKeyword)) {
      return true;
    }
    return false;
  });

  const isNoResult = keyword.length && !filteredTokens.length;

  return (
    <Flex flexDir="column" mt={'24px'} flex={1} h="0px">
      <SearchInput
        isDisabled={showNetworkTips}
        placeholder="Search Token by name"
        onChange={onChangeKeyword}
      />

      <SectionTitle mt={'20px'}>
        {formatMessage({ id: 'select-modal.select.token.title' })}
      </SectionTitle>

      {showNetworkTips ? (
        <Flex
          flexDir="column"
          alignItems="center"
          py={'32px'}
          fontWeight={400}
          lineHeight={'20px'}
          color={theme.colors[colorMode].text.secondary}
        >
          <NoNetworkIcon mb={'16px'} />
          {formatMessage({ id: 'select-modal.select.network.select-first' })}
        </Flex>
      ) : isNoResult ? (
        <NoResultFound py={'32px'} />
      ) : (
        <Flex mt={'8px'} mx={`-${'20px'}`} flexDir="column" flex={1} h="0px" overflowY="auto">
          <VirtualList data={filteredTokens} itemHeight={60} itemKey="id">
            {(item) => (
              <Box pb={'8px'}>
                <TokenListItem
                  tokenUrl={formatTokenUrl(selectedNetwork?.tokenUrlPattern, item.address)}
                  key={item.address}
                  data={item}
                  onClick={() => onSelect(item)}
                  unavailableTips={formatMessage({
                    id: 'select-modal.token.unavailable-tooltip',
                  })}
                />
              </Box>
            )}
          </VirtualList>
        </Flex>
      )}
    </Flex>
  );
}
