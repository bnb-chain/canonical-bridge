import { SystemProps } from '@chakra-ui/react';
import { createContext } from 'react';

export const Context = createContext<{
  orientation: 'horizontal' | 'vertical';
  size?: SystemProps['flexBasis'] | 'fill';
}>({ orientation: 'horizontal' });
