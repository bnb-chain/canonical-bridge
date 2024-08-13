import { CloseIcon } from '@bnb-chain/icons';
import { Button, ButtonProps, ComponentWithAs, forwardRef } from '@chakra-ui/react';

import { theme } from '../../modules/theme';

type Props = Omit<ButtonProps, 'children'>;

export const ToastCloseButton: ComponentWithAs<'button', Props> = forwardRef<Props, 'button'>(
  (props, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        alignSelf="center"
        minW="auto"
        w={theme.sizes['6']}
        h={theme.sizes['6']}
        p={0}
        borderRadius="50%"
        sx={{
          svg: {
            w: theme.sizes['4'],
            h: theme.sizes['4'],
          },
        }}
        {...props}
      >
        <CloseIcon />
      </Button>
    );
  },
);
