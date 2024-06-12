import { useCallback, useRef } from 'react';

export const useDebounce = (func: any, wait = 800) => {
  let timer = useRef<any>();
  return useCallback(
    (...args: any) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        func(...args);
      }, wait);
    },
    [func, wait]
  );
};
