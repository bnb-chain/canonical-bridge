import { useState } from 'react';

interface UseSearchProps<T = unknown> {
  data: T[];
  filter: (item: T, keyword: string) => boolean;
}

export function useSearch<T>(props: UseSearchProps<T>) {
  const { data, filter } = props;
  const [keyword, setKeyword] = useState('');

  const onSearch = (keyword: string) => {
    setKeyword(keyword);
  };

  const result = data.filter((item) => {
    return filter(item, keyword.toLowerCase());
  });

  const isNoResult = keyword.length > 0 && !result.length;

  return {
    onSearch,
    isNoResult,
    result,
  };
}
