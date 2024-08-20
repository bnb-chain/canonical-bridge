import {
  AccordionItem,
  AccordionItemProps,
  ComponentWithAs,
  Divider,
  forwardRef,
} from '@chakra-ui/react';

import { CLASS_NAMES } from '../constants';

import { NumberedAccordionItemContext } from './context';

export const NumberedAccordionItem: ComponentWithAs<'div', AccordionItemProps> = forwardRef<
  AccordionItemProps,
  'div'
>(({ children, ...otherProps }, ref) => {
  return (
    <AccordionItem
      ref={ref}
      sx={{
        ':not(:first-of-type)': {
          [`.${CLASS_NAMES.DIVIDER}`]: {
            display: 'none',
          },
        },
      }}
      {...otherProps}
    >
      {({ isExpanded, isDisabled }) => {
        return (
          <NumberedAccordionItemContext.Provider value={{ isExpanded, isDisabled }}>
            <Divider />
            {typeof children === 'function'
              ? children({
                  isExpanded,
                  isDisabled,
                })
              : children}
            <Divider />
          </NumberedAccordionItemContext.Provider>
        );
      }}
    </AccordionItem>
  );
});
