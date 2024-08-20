import { createAction } from '@reduxjs/toolkit';

import { BridgesState } from '@/modules/bridges/reducer';

export const setChainConfigs =
  createAction<BridgesState['chainConfigs']>('bridges/setChainConfigs');
