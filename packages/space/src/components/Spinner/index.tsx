import { SpinnerIcon } from '@bnb-chain/icons';
import { ComponentWithAs, forwardRef, IconProps, keyframes } from '@chakra-ui/react';
import type { Keyframes } from '@emotion/react';

const SPINNER: Keyframes = keyframes`
  from {
      transform: rotate(0deg);
  }
  to { 
      transform: rotate(360deg);
  }
`;

export const Spinner: ComponentWithAs<'svg', IconProps> = forwardRef<IconProps, 'svg'>(
  (props, ref) => {
    return (
      <SpinnerIcon
        ref={ref}
        sx={{
          animationName: `${SPINNER}`,
          animationDuration: '1s',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        }}
        {...props}
      />
    );
  },
);
