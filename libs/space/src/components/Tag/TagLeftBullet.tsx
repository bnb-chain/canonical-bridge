import { CircleSolidIcon } from '@bnb-chain/icons';
import { ComponentWithAs, forwardRef, Icon, IconProps, theme } from '@chakra-ui/react';

export const TagLeftBullet: ComponentWithAs<'svg', IconProps> = forwardRef<IconProps, 'svg'>(
  (props, ref) => {
    return (
      <Icon
        ref={ref}
        as={CircleSolidIcon}
        fontSize={theme.sizes['1.5']}
        verticalAlign="top"
        mr={theme.sizes['2']}
        {...props}
      />
    );
  },
);
