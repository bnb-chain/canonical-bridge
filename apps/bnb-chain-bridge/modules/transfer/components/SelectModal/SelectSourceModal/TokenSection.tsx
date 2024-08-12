import { Box, Flex, theme, useColorMode, useIntl } from '@bnb-chain/space';
import { useState } from 'react';

import { BridgeChain, BridgeToken } from '@/modules/bridges/main';
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
    <Flex flexDir="column" mt={theme.sizes['6']} flex={1} h="0px">
      <SearchInput
        isDisabled={showNetworkTips}
        placeholder="Search Token by name"
        onChange={onChangeKeyword}
      />

      <SectionTitle mt={theme.sizes['5']}>Select Token</SectionTitle>

      {showNetworkTips ? (
        <Flex
          flexDir="column"
          alignItems="center"
          py={theme.sizes['8']}
          fontWeight={theme.fontWeights[400]}
          lineHeight={theme.sizes['5']}
          color={theme.colors[colorMode].text.secondary}
        >
          <NoNetworkIcon mb={theme.sizes['4']} />
          Select a network first
        </Flex>
      ) : isNoResult ? (
        <NoResultFound py={theme.sizes['8']} />
      ) : (
        <Flex
          mt={theme.sizes['2']}
          mx={`-${theme.sizes['5']}`}
          flexDir="column"
          flex={1}
          h="0px"
          overflowY="auto"
        >
          <VirtualList data={filteredTokens} itemHeight={60} itemKey="id">
            {(item) => (
              <Box pb={theme.sizes['2']}>
                <TokenListItem
                  chainId={selectedNetwork?.id}
                  key={item.address}
                  data={item}
                  onClick={() => onSelect(item)}
                  unavailableTips={formatMessage({ id: 'select-modal.token.unavailable-tooltip' })}
                />
              </Box>
            )}
          </VirtualList>
        </Flex>
      )}
    </Flex>
  );
}
