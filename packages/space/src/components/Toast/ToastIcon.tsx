import { CenterProps, ComponentWithAs, forwardRef } from '@chakra-ui/react';
import { useContext } from 'react';

import { theme } from '../../modules/theme';
import { IconStatus } from '../IconStatus';

import { Context } from './context';

export const ToastIcon: ComponentWithAs<'div', {}> = forwardRef<CenterProps, never>(
  (props, ref) => {
    const { status } = useContext(Context);

    return <IconStatus ref={ref} status={status} size={theme.sizes['6']} {...props} />;
  },
);
