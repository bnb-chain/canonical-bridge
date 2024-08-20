import { useBreakpointValue } from '@chakra-ui/react';

export interface ResponsiveBreaksInTextFormatValues {
  brOnLg: React.ReactNode;
  brOnLgOrSpace: React.ReactNode;
  brOnMd: React.ReactNode;
  brOnMdOrSpace: React.ReactNode;
  brOnSm: React.ReactNode;
  brOnSmOrSpace: React.ReactNode;
  spaceOnLg: string;
  spaceOnMd: string;
  spaceOnSm: string;
}

export const useResponsiveBreaksInTextFormatValues = (): Record<
  keyof ResponsiveBreaksInTextFormatValues,
  ResponsiveBreaksInTextFormatValues[keyof ResponsiveBreaksInTextFormatValues]
> => {
  const brOnLg =
    useBreakpointValue({
      base: '',
      lg: <br />,
    }) || '';
  const brOnLgOrSpace =
    useBreakpointValue({
      base: ' ',
      lg: <br />,
    }) || ' ';
  const brOnMd =
    useBreakpointValue({
      base: '',
      md: <br />,
      lg: '',
    }) || '';
  const brOnMdOrSpace =
    useBreakpointValue({
      base: ' ',
      md: <br />,
      lg: ' ',
    }) || ' ';
  const brOnSm =
    useBreakpointValue({
      base: <br />,
      md: '',
    }) || '';
  const brOnSmOrSpace =
    useBreakpointValue({
      base: <br />,
      md: ' ',
    }) || ' ';
  const spaceOnLg =
    useBreakpointValue({
      base: '',
      lg: ' ',
    }) || '';
  const spaceOnMd =
    useBreakpointValue({
      base: '',
      md: ' ',
      lg: '',
    }) || '';
  const spaceOnSm =
    useBreakpointValue({
      base: ' ',
      md: '',
    }) || '';

  return {
    brOnLg,
    brOnLgOrSpace,
    brOnMd,
    brOnMdOrSpace,
    brOnSm,
    brOnSmOrSpace,
    spaceOnLg,
    spaceOnMd,
    spaceOnSm,
  };
};
