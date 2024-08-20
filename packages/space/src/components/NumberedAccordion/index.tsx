import { Accordion, AccordionProps } from '@chakra-ui/react';

export { NumberedAccordionButton } from './NumberedAccordionButton';
export { NumberedAccordionItem } from './NumberedAccordionItem';
export { NumberedAccordionNumber } from './NumberedAccordionNumber';
export { NumberedAccordionPanel } from './NumberedAccordionPanel';
export { NumberedAccordionTitle } from './NumberedAccordionTitle';

export const NumberedAccordion = (props: AccordionProps) => {
  return <Accordion allowToggle {...props} />;
};
