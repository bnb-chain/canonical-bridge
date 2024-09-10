import { BridgesState } from '@/modules/bridges/reducer';
import { createAction } from '@/modules/store/createAction';

export const setChainConfigs =
  createAction<BridgesState['chainConfigs']>('bridges/setChainConfigs');
