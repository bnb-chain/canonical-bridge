import { StyleObjectOrFn } from '@chakra-ui/react';
import { createContext } from 'react';

export const Context = createContext<{
  styles: StyleObjectOrFn;
}>({ styles: {} });
