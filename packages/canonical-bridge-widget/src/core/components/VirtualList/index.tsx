import { Flex } from '@bnb-chain/space';
import { useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { useResponsive } from '@/core/hooks/useResponsive';

export interface VirtualListProps<T> {
  data: T[];
  itemHeight?: number;
  children: (item: T, index: number) => React.ReactNode;
}

export function VirtualList<T>(props: VirtualListProps<T>) {
  const { data, children } = props;

  const { isMobile } = useResponsive();

  const scrollbarStyle = useMemo(() => {
    if (isMobile) return undefined;
    return {
      '>div': {
        '::-webkit-scrollbar': {
          width: '8px',
        },
        '::-webkit-scrollbar-track': {
          bg: 'transparent',
        },
        '::-webkit-scrollbar-thumb': {
          h: '20px',
          bg: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '99px',
        },
      },
    };
  }, [isMobile]);

  return (
    <Flex boxSize="100%" sx={scrollbarStyle}>
      <Virtuoso
        style={{
          width: '100%',
          height: '100%',
        }}
        totalCount={data.length}
        itemContent={(index) => {
          return children(data[index], index);
        }}
      />
    </Flex>
  );
}
