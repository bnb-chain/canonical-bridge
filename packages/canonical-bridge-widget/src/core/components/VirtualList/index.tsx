import List, { ListProps } from 'rc-virtual-list';
import { useEffect, useRef, useState } from 'react';

export interface VirtualListProps<T> extends ListProps<T> {}

export function VirtualList<T>(props: VirtualListProps<T>) {
  const { data, ...restProps } = props;

  const ref = useRef<any>();
  const [height, setHeight] = useState(8);
  const [innerData, setInnerData] = useState<T[]>(data);

  useEffect(() => {
    const timer = setTimeout(() => {
      const el = ref.current.nativeElement.parentNode;
      setHeight(el.clientHeight);
      setInnerData(data);
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [data]);

  return (
    <List
      ref={ref}
      data={innerData}
      height={height}
      style={{
        WebkitOverflowScrolling: 'touch',
      }}
      {...restProps}
    />
  );
}
