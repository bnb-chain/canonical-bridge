import { useMemo, useState } from 'react';

interface UseSearchProps<T = unknown> {
  data: T[];
  filter: (item: T, keyword: string) => boolean;
  sorter?: (a: T, b: T) => number;
}

export function useSearch<T>(props: UseSearchProps<T>) {
  const { data, filter, sorter = () => 0 } = props;
  const [keyword, setKeyword] = useState('');

  const onSearch = (keyword: string) => {
    setKeyword(keyword);
  };

  const result = useMemo(() => {
    return data.filter((item) => filter(item, keyword)).sort(sorter);
  }, [data, filter, keyword, sorter]);

  const isNoResult = keyword.length > 0 && !result.length;

  return {
    onSearch,
    isNoResult,
    result,
    keyword,
  };
}
