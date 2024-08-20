import { useEffect, useState } from 'react';

export const usePreloadImage = ({
  src,
}: {
  src: string;
}): { src: string; isLoading: boolean; isError: boolean } => {
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof src !== 'string') {
      setIsLoading(false);
      setIsError(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setIsLoading(false);
      setIsError(false);
    };
    img.onerror = () => {
      setIsLoading(false);
      setIsError(true);
    };
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return {
    src,
    isLoading,
    isError,
  };
};
