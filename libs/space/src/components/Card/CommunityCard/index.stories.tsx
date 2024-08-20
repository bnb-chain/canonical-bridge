import { BNBChainIcon } from '@bnb-chain/icons';
import { Meta } from '@storybook/react';

import { CommunityCard, CommunityCardTitle } from '.';

export default {
  title: 'Components/Molecules/CommunityCard',
  component: CommunityCard,
} as Meta;

export const Default = () => {
  return (
    <CommunityCard as="a" href="https://www.bnbchain.org" target="_blank">
      <BNBChainIcon />
      <CommunityCardTitle>BNB Chain</CommunityCardTitle>
    </CommunityCard>
  );
};
