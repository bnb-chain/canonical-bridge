import { useEffect, useState } from 'react';

export function useWaitForReady(time = 1000) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, time);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return isReady;
}
