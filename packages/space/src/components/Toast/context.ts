import { createContext } from 'react';

import { Status } from '../internal/Status';

export const Context = createContext<{
  status: Status;
}>({ status: 'info' });
