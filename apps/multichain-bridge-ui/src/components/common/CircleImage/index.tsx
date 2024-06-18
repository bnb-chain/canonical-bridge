import { Circle, ImageProps, Image } from '@node-real/uikit';

export interface CircleImageProps extends ImageProps {}

export function CircleImage(props: CircleImageProps) {
  const { boxSize = 28 } = props;

  return (
    <Image
      alt="logo"
      boxSize={boxSize}
      loading="lazy"
      fallback={
        <Circle boxSize={boxSize} overflow="hidden" bg="readable.disabled" />
      }
      {...props}
    />
  );
}
