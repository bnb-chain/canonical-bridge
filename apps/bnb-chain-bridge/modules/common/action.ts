import { createAction } from '@reduxjs/toolkit';

import { CommonState } from '@/modules/common/reducer';

export const setFooterMenus = createAction<CommonState['footerMenus']>('common/setFooterMenus');
