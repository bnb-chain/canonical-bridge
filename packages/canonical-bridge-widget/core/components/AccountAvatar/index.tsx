import { AvatarBlur, theme, useColorMode } from '@bnb-chain/space';
import { ComponentPropsWithoutRef, useMemo } from 'react';

export const AccountAvatar = ({
  address,
  size,
}: { address?: string } & Omit<ComponentPropsWithoutRef<typeof AvatarBlur>, 'value'>) => {
  const { colorMode } = useColorMode();

  const colors: `#${string}`[] = useMemo(() => {
    const brand = Object.entries(theme.colors[colorMode].support.brand);
    return brand.map((it) => it[1]) as `#${string}`[];
  }, [colorMode]);

  return <AvatarBlur size={size} value={address ?? ''} colors={colors} />;
};
