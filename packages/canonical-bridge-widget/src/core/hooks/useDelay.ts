import { useEffect, useRef, useState } from 'react';

interface UseDelayProps {
  delay?: number;
  callback?: () => void;
}

export function useDelay(props?: UseDelayProps) {
  const { delay = 2000, callback } = props ?? {};

  const [isReady, setIsReady] = useState(false);

  const callbackRef = useRef<() => void>();
  callbackRef.current = callback;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
      callbackRef.current?.();
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [delay]);

  return isReady;
}
