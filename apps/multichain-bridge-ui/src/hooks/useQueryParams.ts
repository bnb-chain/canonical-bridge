import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export function useQueryParams() {
  const query = useSearchParams();

  const params = useMemo(() => {
    const obj: Record<string, string> = {};
    for (let [key, value] of query) {
      obj[key] = value ? String(value) : '';
    }
    return obj;
  }, [query]);

  return params;
}
