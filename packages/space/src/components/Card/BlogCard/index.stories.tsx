import { Meta } from '@storybook/react';

import { BlogCard } from '.';

const DATA = {
  title: 'BNB Chain Celebrates 3 Years of Web3 Growth and Resilience',
  slug: 'bnb-chain-celebrates-3-years-of-web3-growth-and-resilience',
  feature_image: 'https://bnbchain.ghost.io/content/images/2023/08/wide-1.png',
  published_at: '2023-08-24T10:26:48.000+00:00',
  reading_time: 3,
};

export default {
  title: 'Components/Molecules/BlogCard',
  component: BlogCard,
} as Meta;

export const Default = () => {
  return <BlogCard data={DATA} />;
};
