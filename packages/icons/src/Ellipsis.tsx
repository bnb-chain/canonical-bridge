import { createIcon } from '@chakra-ui/icons';
import React from 'react';

export const EllipsisIcon = createIcon({
  displayName: 'EllipsisIcon',
  viewBox: '0 0 24 24',
  path: (
    <>
      <circle cx="6" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="18" cy="12" r="1.5" fill="currentColor" />
    </>
  ),
});
