import { BNBChainIcon } from '@bnb-chain/icons';
import { Meta } from '@storybook/react';

import { ResourceCard, ResourceCardTitle } from '.';

export default {
  title: 'Components/Molecules/ResourceCard',
  component: ResourceCard,
} as Meta;

export const Default = () => {
  return (
    <ResourceCard as="a" href="https://www.bnbchain.org" target="_blank">
      <BNBChainIcon />
      <ResourceCardTitle>BNB Chain</ResourceCardTitle>
    </ResourceCard>
  );
};
