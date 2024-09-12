import { useRouter } from 'next/router';
import { useMemo } from 'react';

export function useQueryParams() {
  const { query } = useRouter();

  const params = useMemo(() => {
    const obj: Record<string, string> = {};
    Object.entries(query).forEach(([key, value]) => {
      obj[key] = value ? String(value) : '';
    });
    return obj;
  }, [query]);

  return params;
}
