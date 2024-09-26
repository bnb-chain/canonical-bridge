import { Virtuoso } from 'react-virtuoso';

export interface VirtualListProps<T> {
  data: T[];
  itemHeight?: number;
  children: (item: T, index: number) => React.ReactNode;
}

export function VirtualList<T>(props: VirtualListProps<T>) {
  const { data, children } = props;

  return (
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
  );
}
