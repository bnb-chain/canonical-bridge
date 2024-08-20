import { Skeleton, SkeletonCircle, VStack } from '@chakra-ui/react';
import { Meta } from '@storybook/react';

import { theme } from '../../modules/theme';
import { Space } from '../Space';

export default {
  title: 'Components/Atoms/Skeleton',
} as Meta;

export const Default = () => {
  return (
    <>
      <SkeletonCircle size={theme.sizes['20']} />
      <Space size={theme.sizes['2']} />
      <Skeleton h={theme.sizes['20']} />
      <Space size={theme.sizes['2']} />
      <VStack
        spacing={theme.sizes['2']}
        sx={{
          '> *': {
            w: '100%',
            h: theme.sizes['5'],
          },
        }}
      >
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </VStack>
    </>
  );
};
