import { Circle, ImageProps, Image, theme, useColorMode, FlexProps } from '@bnb-chain/space';
import { useEffect, useState } from 'react';

export interface IconImageProps extends ImageProps {
  fallbackBgColor?: FlexProps['bg'];
}

export function IconImage(props: IconImageProps) {
  const { boxSize = '32px', alt = 'app-image', src, fallbackBgColor, ...restProps } = props;

  const { colorMode } = useColorMode();
  const [isError, setIsError] = useState(!src);

  useEffect(() => {
    setIsError(!src);
  }, [src]);

  return (
    <>
      {isError ? (
        <Circle
          className="default-icon"
          size={boxSize}
          {...restProps}
          bg={fallbackBgColor ?? theme.colors[colorMode].support.primary[3]}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          boxSize={boxSize}
          borderRadius="full"
          loading="lazy"
          onError={() => {
            setIsError(true);
          }}
          {...restProps}
        />
      )}
    </>
  );
}
