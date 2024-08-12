import { createAction } from '@reduxjs/toolkit';

import { BridgesState } from '@/modules/bridges/main/reducer';

export const setEvmConnectData = createAction<BridgesState['evmConnectData']>(
  'common/setEvmConnectData',
);
