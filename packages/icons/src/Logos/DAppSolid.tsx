import { createIcon } from '@chakra-ui/icons';
import React from 'react';

export const DAppSolidIcon = createIcon({
  displayName: 'DAppIcon',
  viewBox: '0 0 24 24',
  path: (
    <>
      <rect x="5" y="5" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="5" y="13" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="13.1367" y="13.1367" width="6" height="6" rx="1" fill="currentColor" />
      <rect
        x="16.0684"
        y="4"
        width="5.75346"
        height="5.75346"
        rx="1"
        transform="rotate(45 16.0684 4)"
        fill="currentColor"
      />
    </>
  ),
});
