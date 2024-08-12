import { FlexProps, Flex, theme, useColorMode, Box, Text, Space } from '@bnb-chain/space';
import { useState } from 'react';

import { IconImage } from '@/core/components/IconImage';
import { BridgeChain, isAvailableChainOrToken } from '@/modules/bridges/main';
import { VirtualList } from '@/core/components/VirtualList';
import { NoResultFound } from '@/modules/transfer/components/SelectModal/components/NoResultFound';
import { SearchInput } from '@/modules/transfer/components/SelectModal/components/SearchInput';
import { UnavailableTag } from '@/modules/transfer/components/SelectModal/components/UnavailableTag';
import { SectionTitle } from '@/modules/transfer/components/SelectModal/components/SectionTitle';

interface NetworkPanelProps {
  showTitle?: boolean;
  networks: BridgeChain[];
  onSelect: (value: BridgeChain) => void;
  unavailableTips: string;
}

export function NetworkPanel(props: NetworkPanelProps) {
  const { showTitle = false, networks = [], onSelect, unavailableTips } = props;

  const [keyword, setKeyword] = useState('');

  const onChangeKeyword = (keyword: string) => {
    setKeyword(keyword);
  };

  const filteredNetworks = networks.filter((item) => {
    const tmpKeyword = keyword.toLowerCase();
    return item.name.toLowerCase().includes(tmpKeyword);
  });

  const isNoResult = keyword.length && !filteredNetworks.length;

  return (
    <Flex flexDir="column" flex={1} h="0px">
      <SearchInput onChange={onChangeKeyword} placeholder="Search Network by name" />

      {showTitle ? (
        <SectionTitle mt={theme.sizes['5']}>Select Network</SectionTitle>
      ) : (
        <Space size={theme.sizes['3']} />
      )}

      {isNoResult ? (
        <NoResultFound py={theme.sizes['12']} />
      ) : (
        <Flex
          flexDir="column"
          flex={1}
          h="0px"
          mt={theme.sizes['2']}
          overflowY="auto"
          mx={`-${theme.sizes['5']}`}
        >
          <VirtualList data={filteredNetworks} itemHeight={56} itemKey="id">
            {(item) => (
              <Box pb={theme.sizes['2']}>
                <NetworkListItem
                  data={item}
                  onClick={() => onSelect(item)}
                  unavailableTips={unavailableTips}
                />
              </Box>
            )}
          </VirtualList>
        </Flex>
      )}
    </Flex>
  );
}

interface NetworkListItemProps extends FlexProps {
  data: BridgeChain;
  unavailableTips: string;
}

export function NetworkListItem(props: NetworkListItemProps) {
  const { data, unavailableTips, ...restProps } = props;

  const { colorMode } = useColorMode();

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      py={theme.sizes['2']}
      px={theme.sizes['5']}
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
        <IconImage src={data.icon} boxSize={theme.sizes['8']} alt={data.name} />
        <Text textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
          {data.name}
        </Text>
      </Flex>
      {!isAvailableChainOrToken(data) && <UnavailableTag tips={unavailableTips} />}
    </Flex>
  );
}
