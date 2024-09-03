import { Box } from '@bnb-chain/space';
import React from 'react';

import { env } from '@/core/configs/env';

export const ProfileBg = React.memo(() => {
  return (
    <Box w={'335px'} h={'80px'}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${env.ASSET_PREFIX}/images/ProfileBg.png`}
        alt="Profile Background"
        width={355}
        height={80}
      />
    </Box>
  );
});

ProfileBg.displayName = 'ProfileBg';
