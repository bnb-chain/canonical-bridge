import { createContext } from 'react';

export const NumberedAccordionItemContext = createContext<{
  isExpanded: boolean;
  isDisabled: boolean;
}>({ isExpanded: false, isDisabled: false });
