import {
  AccordionPanel,
  AccordionPanelProps,
  ComponentWithAs,
  forwardRef,
  useBreakpointValue,
  useColorMode,
} from '@chakra-ui/react';

import { theme } from '../../modules/theme';
import { TYPOGRAPHY_STYLES } from '../Typography';

export const NumberedAccordionPanel: ComponentWithAs<'div', AccordionPanelProps> = forwardRef<
  AccordionPanelProps,
  'div'
>((props, ref) => {
  const { colorMode } = useColorMode();

  const typography: keyof typeof TYPOGRAPHY_STYLES['body'] =
    useBreakpointValue({
      base: 'md',
      md: 'lg',
    }) || 'md';

  return (
    <AccordionPanel
      ref={ref}
      mx={{ base: theme.sizes['1'], md: theme.sizes['8'] }}
      pl={{ base: theme.sizes['20'], md: theme.sizes['16'], lg: theme.sizes['24'] }}
      pr={{ base: theme.sizes['12'], md: theme.sizes['16'] }}
      pt={0}
      pb={{ base: theme.sizes['4'], md: theme.sizes['10'], lg: theme.sizes['10'] }}
      color={theme.colors[colorMode].text.secondary}
      {...TYPOGRAPHY_STYLES['body'][typography]}
      {...props}
    />
  );
});
