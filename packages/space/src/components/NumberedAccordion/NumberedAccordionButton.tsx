import {
  AccordionButton,
  AccordionButtonProps,
  ComponentWithAs,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';
import React, { useContext } from 'react';

import { theme } from '../../modules/theme';

import { NumberedAccordionItemContext } from './context';

type Props = AccordionButtonProps & {
  icon: React.ReactNode;
};

export const NumberedAccordionButton: ComponentWithAs<'button', Props> = forwardRef<
  Props,
  'button'
>(({ icon, children, ...otherProps }, ref) => {
  const { colorMode } = useColorMode();

  const { isExpanded } = useContext(NumberedAccordionItemContext);

  return (
    <AccordionButton
      ref={ref}
      w="100%"
      display="flex"
      alignItems="center"
      px={{ base: theme.sizes['5'], md: 0, lg: theme.sizes['8'] }}
      py={{ base: theme.sizes['4'], md: theme.sizes['6'] }}
      _hover={{
        ...(!isExpanded && {
          bg: { lg: theme.colors[colorMode].layer[2].hover },
          borderRadius: { lg: theme.sizes['2'] },
          // Hide dividers on hover.
          outline: { lg: `${theme.sizes['1']} solid ${theme.colors[colorMode].layer[2].hover}` },
          outlineOffset: { lg: theme.sizes['0'] },
        }),
      }}
      sx={{
        svg: {
          fontSize: { base: theme.sizes['6'], md: theme.sizes['10'] },
          color: theme.colors[colorMode].text.primary,
        },
      }}
      {...otherProps}
    >
      {children}
      {icon}
    </AccordionButton>
  );
});
