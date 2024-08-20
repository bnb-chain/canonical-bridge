import { useMemo, useRef } from 'react';
import { isEqual } from 'lodash';

export function useSavedValue<T>(value: T) {
  const saveRef = useRef<T>(value);

  const nextValue = useMemo(() => {
    if (!isEqual(value, saveRef.current)) {
      saveRef.current = value;
    }
    return saveRef.current;
  }, [value]);

  return nextValue;
}
