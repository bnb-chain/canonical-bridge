import { ComponentWithAs, Flex, FlexProps, forwardRef } from '@chakra-ui/react';
import { useContext } from 'react';

import { Context } from './context';

export const TimelineItem: ComponentWithAs<'div', FlexProps> = forwardRef<FlexProps, 'div'>(
  (props, ref) => {
    const { orientation, size } = useContext(Context);

    return (
      <Flex
        ref={ref}
        alignItems="center"
        justifyContent="center"
        flexDirection={orientation === 'horizontal' ? 'row' : 'column'}
        sx={{
          ...(size === 'fill' && {
            ':not(:last-of-type)': {
              flex: 1,
            },
          }),
        }}
        {...props}
      />
    );
  },
);
