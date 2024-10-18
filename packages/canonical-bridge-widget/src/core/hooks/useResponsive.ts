import { useBreakpointValue } from '@bnb-chain/space';

export function useResponsive() {
  const isMobile = useBreakpointValue([true, true, false]);

  return {
    isMobile,
  };
}
