import {
  FlexProps,
  Flex,
  useColorMode,
  Box,
  Text,
  Space,
  useIntl,
  useTheme,
} from '@bnb-chain/space';
import { useState } from 'react';

import { IconImage } from '@/core/components/IconImage';
import { VirtualList } from '@/core/components/VirtualList';
import { NoResultFound } from '@/modules/transfer/components/SelectModal/components/NoResultFound';
import { SearchInput } from '@/modules/transfer/components/SelectModal/components/SearchInput';
import { UnavailableTag } from '@/modules/transfer/components/SelectModal/components/UnavailableTag';
import { SectionTitle } from '@/modules/transfer/components/SelectModal/components/SectionTitle';
import { IBridgeChain } from '@/modules/aggregator/types';
import { isCompatibleChainOrToken } from '@/modules/aggregator/shared/isCompatibleChainOrToken';

interface NetworkPanelProps {
  showTitle?: boolean;
  networks: IBridgeChain[];
  onSelect: (value: IBridgeChain) => void;
  unavailableTips: string;
}

export function NetworkPanel(props: NetworkPanelProps) {
  const { showTitle = false, networks = [], onSelect, unavailableTips } = props;
  const { formatMessage } = useIntl();
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
        <SectionTitle mt={'20px'}>
          {formatMessage({ id: 'select-modal.select.network.title' })}
        </SectionTitle>
      ) : (
        <Space size={'12px'} />
      )}

      {isNoResult ? (
        <NoResultFound py={'48px'} />
      ) : (
        <Flex flexDir="column" flex={1} h="0px" mt={'8px'} overflowY="auto" mx={`-${'20px'}`}>
          <VirtualList data={filteredNetworks} itemHeight={56} itemKey="id">
            {(item) => (
              <Box pb={'8px'}>
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
  data: IBridgeChain;
  unavailableTips: string;
}

export function NetworkListItem(props: NetworkListItemProps) {
  const { data, unavailableTips, ...restProps } = props;
  const theme = useTheme();
  const { colorMode } = useColorMode();

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      py={'8px'}
      px={'20px'}
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
        <IconImage src={data.icon} boxSize={'32px'} alt={data.name} />
        <Text
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="nowrap"
          color={theme.colors[colorMode].modal.item.text.primary}
        >
          {data.name}
        </Text>
      </Flex>
      {!isCompatibleChainOrToken(data) && <UnavailableTag tips={unavailableTips} />}
    </Flex>
  );
}
