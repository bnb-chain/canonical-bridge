import { useBreakpointValue } from '@chakra-ui/react';

export const useMedia = () => {
  const media = (
    useBreakpointValue({
      base: 'MOBILE',
      md: 'TABLET',
      lg: 'PC',
    }) || 'PC'
  ).toLowerCase();
  return {
    isPc: media === 'pc',
    isTablet: media === 'tablet',
    isMobile: media === 'mobile',
  };
};
