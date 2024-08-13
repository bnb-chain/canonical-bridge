import { Hide, Show } from '@chakra-ui/react';

import { Base } from './Base';
import { Medium } from './Medium';

export const Language = () => {
  return (
    <>
      <Show below="md">
        <Base />
      </Show>
      <Hide below="md">
        <Medium />
      </Hide>
    </>
  );
};
