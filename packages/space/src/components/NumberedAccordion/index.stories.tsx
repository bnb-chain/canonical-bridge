import { AddIcon, MinusIcon } from '@bnb-chain/icons';
import { Meta } from '@storybook/react';

import {
  NumberedAccordion,
  NumberedAccordionButton,
  NumberedAccordionItem,
  NumberedAccordionNumber,
  NumberedAccordionPanel,
  NumberedAccordionTitle,
} from '.';

export default {
  title: 'Components/Molecules/NumberedAccordion',
  component: NumberedAccordion,
} as Meta;

const DATA = [
  {
    id: '1',
    title: 'Item 1',
    description: 'Some description.',
  },
  {
    id: '2',
    title: 'Item 2',
    description: 'Some description.',
  },
  {
    id: '3',
    title: 'Item 3',
    description: 'Some description.',
  },
];

export const Default = () => {
  return (
    <NumberedAccordion>
      {DATA.map((it, index) => (
        <NumberedAccordionItem key={it.id}>
          {({ isExpanded }) => (
            <>
              <NumberedAccordionButton icon={isExpanded ? <MinusIcon /> : <AddIcon />}>
                <NumberedAccordionNumber>{index + 1}</NumberedAccordionNumber>
                <NumberedAccordionTitle>{it.title}</NumberedAccordionTitle>
              </NumberedAccordionButton>
              <NumberedAccordionPanel>{it.description}</NumberedAccordionPanel>
            </>
          )}
        </NumberedAccordionItem>
      ))}
    </NumberedAccordion>
  );
};
