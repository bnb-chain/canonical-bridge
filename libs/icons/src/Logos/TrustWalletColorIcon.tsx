import { createIcon } from '@chakra-ui/icons';
import React from 'react';

export const TrustWalletColorIcon = createIcon({
  displayName: 'TrustWalletColorIcon',
  viewBox: '0 0 24 24',
  path: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 5.6001L11.9998 3V21C6.28561 18.5999 4 13.9999 4 11.4001V5.6001Z" fill="#48FF91" />
      <path
        d="M20 5.6001L12.0002 3V21C17.7144 18.5999 20 13.9999 20 11.4001V5.6001Z"
        fill="url(#paint0_linear_6562_8924)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_6562_8924"
          x1="11.627"
          y1="23.2523"
          x2="18.175"
          y2="-0.431276"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.26" stopColor="#48FF91" />
          <stop offset="0.66" stopColor="#0094FF" />
          <stop offset="0.8" stopColor="#0038FF" />
          <stop offset="0.89" stopColor="#0500FF" />
        </linearGradient>
      </defs>
    </svg>
  ),
});
