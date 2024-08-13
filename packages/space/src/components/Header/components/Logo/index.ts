import { BoxProps, ComponentWithAs, IconProps } from '@chakra-ui/react';

import { Icon } from './Icon';
import { Primary } from './Primary';
import { Greenfield } from './Greenfield';

export const Logo: {
  Icon: (props: BoxProps) => JSX.Element;
  Primary: ComponentWithAs<'svg', IconProps>;
  Greenfield: ComponentWithAs<'svg', IconProps>;
} = { Icon, Primary, Greenfield };
